import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Card, CardSectionHeader, PDFSvg, Loader, StatusTable, Row, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";

const DocumentDetails = ({ t, data, documents }) => {
  return (
    <Fragment>
      {data?.map((document, index) => (
        <Fragment>
          <div>
            <CardSectionHeader>{t(`BPA_DOCUMENT_${document?.documentType}`)}</CardSectionHeader>
            <a target="_" href={documents[document.fileStoreId]?.split(",")[0]}>
              <PDFSvg />
            </a>
          </div>
          <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        </Fragment>
      ))}
    </Fragment>
  );
}

const ApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split('.')[0]
  const [appDetails, setAppDetails] = useState({});
  const [showToast, setShowToast] = useState(null);

  const { isLoading, data: applicationDetails } = Digit.Hooks.obps.useLicenseDetails(state, { applicationNumber: id, tenantId: state }, {});
  
  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.obps.useBPAREGApplicationActions(tenantId);

  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId?.split('.')[0],
    id: id,
    moduleCode: "BPAREG",
  });

  const closeToast = () => {
    setShowToast(null);
  };


  useEffect(() => {
    if (applicationDetails) {
      const fileStoresIds = applicationDetails?.applicationData?.tradeLicenseDetail?.applicationDocuments.map(document => document?.fileStoreId);
      Digit.UploadServices.Filefetch(fileStoresIds, tenantId.split(".")[0])
        .then(res => {
          const { applicationDetails: details } = applicationDetails;
          setAppDetails({ ...applicationDetails, applicationDetails: [...details, { title: "BPA_DOC_DETAILS_SUMMARY", belowComponent: () => <DocumentDetails t={t} data={applicationDetails?.applicationData?.tradeLicenseDetail?.applicationDocuments} documents={res?.data}  /> }] })
        })
    }
  }, [applicationDetails]);

  return (
    <div >
      <div style={{marginLeft: "15px"}}>
        <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      </div>
      <ApplicationDetailsTemplate
        applicationDetails={appDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={appDetails?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService={workflowDetails?.data?.applicationBusinessService ? workflowDetails?.data?.applicationBusinessService : applicationDetails?.applicationData?.businessService}
        moduleCode="BPAREG"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"WF_NEWTL_"}
      />
    </div>
  )
}

export default ApplicationDetail;