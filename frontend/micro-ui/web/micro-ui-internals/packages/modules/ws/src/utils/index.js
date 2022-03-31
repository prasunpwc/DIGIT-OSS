export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };

  export const convertEpochToDateDMY = (dateEpoch) => {
  if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
    return "NA";
  }
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};


  export const convertEpochToDate = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };

  export const pdfDownloadLink = (documents = {}, fileStoreId = "", format = "") => {
    /* Need to enhance this util to return required format*/
  
    let downloadLink = documents[fileStoreId] || "";
    let differentFormats = downloadLink?.split(",") || [];
    let fileURL = "";
    differentFormats.length > 0 &&
      differentFormats.map((link) => {
        if (!link.includes("large") && !link.includes("medium") && !link.includes("small")) {
          fileURL = link;
        }
      });
    return fileURL;
  };
  
  /*   method to get filename  from fielstore url*/
  export const DownloadReceipt = async (consumerCode, tenantId, businessService, pdfKey = "consolidatedreceipt") => {
    tenantId = tenantId ? tenantId : Digit.ULBService.getCurrentTenantId();
    await Digit.Utils.downloadReceipt(consumerCode, businessService, "consolidatedreceipt", tenantId);
  };
  export const pdfDocumentName = (documentLink = "", index = 0) => {
    let documentName = decodeURIComponent(documentLink.split("?")[0].split("/").pop().slice(13)) || `Document - ${index + 1}`;
    return documentName;
  };
  
  export const getTransaltedLocality = (data) => {
    let localityVariable = data?.tenantId?.replaceAll(".","_") || stringReplaceAll(data?.tenantId,".","_");
    return (localityVariable.toUpperCase()+"_REVENUE_"+data?.locality?.code);
  }

  export const getQueryStringParams = (query) => {
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query).split("&").reduce((params, param) => {
        let [key, value] = param.split("=");
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
        return params;
      }, {})
      : {};
  };

export  const getAddress = (address, t) => {
    return `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
      address?.landmark ? `${address?.landmark}, ` : ""
    }${ address.locality.code ?  t(address?.locality.code) : ""}, ${ address.city.code ?  t(address?.city.code) : ""},${address?.pincode ? `${address.pincode}` : " "}`
} 

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const convertEpochToDates = (dateEpoch) => {
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${month}/${day}/${year}`;
  } else {
    return null;
  }
};

export const getPattern = type => {
  switch (type) {
    case "WSOnlyNumbers":
    return /^[0-9]*$/i;
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
    case "MobileNo":
      return /^[6789][0-9]{9}$/i;
    case "Amount":
      return /^[0-9]{0,8}$/i;
    case "NonZeroAmount":
      return /^[1-9][0-9]{0,7}$/i;
    case "DecimalNumber":
      return /^\d{0,8}(\.\d{1,2})?$/i;
    //return /(([0-9]+)((\.\d{1,2})?))$/i;
    case "Email":
      return /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;
    case "Address":
      return /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,500}$/i;
    case "PAN":
      return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;
    case "TradeName":
      return /^[-@.\/#&+\w\s]*$/
    //return /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,100}$/i;
    case "Date":
      return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;
    case "UOMValue":
      return /^(0)*[1-9][0-9]{0,5}$/i;
    case "OperationalArea":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "NoOfEmp":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "GSTNo":
      return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/i;
    case "DoorHouseNo":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,50}$/i;
    case "BuildingStreet":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,64}$/i;
    case "Pincode":
      return /^[1-9][0-9]{5}$/i;
    case "Landline":
      return /^[0-9]{11}$/i;
    case "PropertyID":
      return /^[a-zA-z0-9\s\\/\-]$/i;
    case "ElectricityConnNo":
      return /^.{1,15}$/i;
    case "DocumentNo":
      return /^[0-9]{1,15}$/i;
    case "eventName":
      return /^[^\$\"<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”]{1,65}$/i;
    case "eventDescription":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
    case "cancelChallan":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
    case "FireNOCNo":
      return /^[a-zA-Z0-9-]*$/i;
    case "consumerNo":
      return /^[a-zA-Z0-9/-]*$/i;
    case "AadharNo":
      //return /^\d{4}\s\d{4}\s\d{4}$/;
      return /^([0-9]){12}$/;
    case "ChequeNo":
      return /^(?!0{6})[0-9]{6}$/;
    case "Comments":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;
    case "OldLicenceNo":
      return /^[a-zA-Z0-9-/]{0,64}$/;
  }
};

export const getFiles = async (filesArray, tenant) => {
  const response = await Digit.UploadServices.Filefetch(filesArray, tenant);
  response?.data?.fileStoreIds?.[0]?.url ? window.open(response?.data?.fileStoreIds?.[0]?.url) : null;
}

export const createPayloadOfWS = async (data) => {

  data?.cpt?.details?.owners?.forEach(owner => {
    if(owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress
  })

  let payload = {
    water: data?.ConnectionDetails?.[0]?.water,
    sewerage: data?.ConnectionDetails?.[0]?.sewerage,
    proposedTaps: data?.ConnectionDetails?.[0]?.proposedTaps && Number(data?.ConnectionDetails?.[0]?.proposedTaps),
    proposedPipeSize: data?.ConnectionDetails?.[0]?.proposedPipeSize?.size && Number(data?.ConnectionDetails?.[0]?.proposedPipeSize?.size),
    proposedWaterClosets: data?.ConnectionDetails?.[0]?.proposedWaterClosets && Number(data?.ConnectionDetails?.[0]?.proposedWaterClosets),
    proposedToilets: data?.ConnectionDetails?.[0]?.proposedToilets && Number(data?.ConnectionDetails?.[0]?.proposedToilets),
    connectionHolders: !data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails ? [{
      correspondenceAddress: data?.ConnectionHolderDetails?.[0]?.address || "",
      fatherOrHusbandName: data?.ConnectionHolderDetails?.[0]?.guardian || "",
      gender: data?.ConnectionHolderDetails?.[0]?.gender?.code || "",
      mobileNumber: data?.ConnectionHolderDetails?.[0]?.mobileNumber || "",
      name: data?.ConnectionHolderDetails?.[0]?.name || "",
      ownerType: data?.ConnectionHolderDetails?.[0]?.ownerType?.code || "",
      relationship: data?.ConnectionHolderDetails?.[0]?.relationship?.code || "",
      sameAsPropertyAddress: data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails
    }] : null,
    service: (data?.ConnectionDetails?.[0]?.water && !data?.ConnectionDetails?.[0]?.sewerage) ? "Water" : (!data?.ConnectionDetails?.[0]?.water && data?.ConnectionDetails?.[0]?.sewerage) ? "Sewerage" : "Water And Sewerage",
    property: data?.cpt?.details,
    propertyId: data?.cpt?.details?.propertyId,
    roadCuttingArea: null,
    noOfTaps: null,
    noOfWaterClosets: null,
    noOfToilets: null,
    additionalDetails: {
      initialMeterReading: null,
      detailsProvidedBy: "",
      locality: data?.cpt?.details?.address?.locality?.code,
    },
    tenantId: data?.cpt?.details?.address?.tenantId,
    processInstance: {
      action: "INITIATE"
    },
    channel: "CFC_COUNTER"
  }
  sessionStorage.setItem("WS_DOCUMENTS_INOF", JSON.stringify(data?.DocumentsRequired?.documents));
  sessionStorage.setItem("WS_PROPERTY_INOF", JSON.stringify(data?.cpt?.details));
  return payload;
}

export const updatePayloadOfWS = async (data) => {
  let payload = {
    ...data,
    processInstance: {
      ...data?.processInstance,
      action: "SUBMIT_APPLICATION"
    },
    documents: JSON.parse(sessionStorage.getItem("WS_DOCUMENTS_INOF")),
    property: JSON.parse(sessionStorage.getItem("WS_PROPERTY_INOF")),
    connectionType: "Non Metered"
  }
  return payload;
}


export const convertToWSUpdate = (data) => {

  let formdata = {
    "WaterConnection": {
      ...data?.WaterConnectionResult?.WaterConnection?.[0],
       "documents": [...data?.documents?.documents],
      "processInstance": {
          "action": "SUBMIT_APPLICATION",
      }
      
  }
  }
  return formdata;
}

export const convertToSWUpdate = (data) => {

  let formdata = {
    "SewerageConnection": {
      ...data?.SewerageConnectionResult?.SewerageConnections?.[0],
       "documents": [...data?.documents?.documents],
      "processInstance": {
          "action": "SUBMIT_APPLICATION",
      },
      
  }
  }
  return formdata;
}

export const getOwnersforPDF = (property,t) => {
  let interarray = [];
  let finalarray = [];
  property?.owners?.map((ob,index) => {
  interarray =   [
          { title: t(`WS_OWNER - ${index}`), value: "" },
          { title: t("WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL"), value: ob?.mobileNumber || "N/A" },
          { title: t("WS_MYCONNECTIONS_OWNER_NAME"), value: ob?.name || "N/A" },
          {
            title: t("WS_OWNER_DETAILS_EMAIL_LABEL"),
            value: ob?.emailId || "N/A",
          },
          {
            title: t("WS_OWN_DETAIL_GENDER_LABEL"),
            value: ob?.gender || "N/A",
          },
          { title: t("WS_OWN_DETAIL_DOB_LABEL"), value: "N/A" },
          { title: t("WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"), value: ob?.fatherOrHusbandName || "N/A" },
          { title: t("WS_OWN_DETAIL_RELATION_LABEL"), value: ob?.relationship || "N/A" },
          { title: t("WS_CONN_HOLDER_OWN_DETAIL_CROSADD"), value: ob?.correspondenceAddress || "N/A" },
          { title: t("WS_CONN_HOLDER_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"), value: "none" },
        ]
      finalarray = finalarray.concat(interarray);
      })
    return finalarray;
}

export const getDocumentsForPDF = (app,t) => {
let finaldocarray=[];
  app?.documents?.map((doc) => {
    finaldocarray.push(
      {
      title: t(doc?.documentType),
      value: doc?.fileName,
    })
  })
}

export  const getPDFData = (application,data,tenantInfo, t) => {

  return {
    t: t,
    tenantId: tenantInfo?.code,
    name: `${t(tenantInfo?.i18nKey)} ${t(`ULBGRADE_${tenantInfo?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`)}`,
    email: tenantInfo?.emailId,
    phoneNumber: tenantInfo?.contactNumber,
    heading: t(`WS_${application?.applicationType}`),
    breakPageLimit: 4,
    details: [
      {
        title: t("CS_TITLE_APPLICATION_DETAILS"),
        values: [
          { title: t("WS_COMMON_APPLICATION_NO_LABEL"), value: application?.applicationNo },
        ],
      },
      {
        title: t("WS_COMMON_PROPERTY_DETAILS"),
        values: [
          { title: t("WS_PROPERTY_ID_LABEL"), value: application?.propertyId || "N/A" },
          { title: t("WS_PROPERTY_TYPE_LABEL"), value: data?.cpt?.details?.propertyType || "N/A" },
          { title: t("WS_PROPERTY_USAGE_TYPE_LABEL"), value: data?.cpt?.details?.usageCategory || "N/A" },
          { title: t("WS_PROPERTY_SUB_USAGE_TYPE_LABEL"), value: "N/A" },
          { title: t("WS_PROP_DETAIL_PLOT_SIZE_LABEL"), value: data?.cpt?.details?.superBuiltUpArea || "N/A" },
          { title: t("WS_PROPERTY_NO_OF_FLOOR_LABEL"), value: data?.cpt?.details?.noOfFloors || "N/A" },
          { title: t("WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC"), value: data?.cpt?.details?.additionalDetails?.isRainwaterHarvesting },
        ],
      },
      {
        title: t("WS_COMMON_PROP_LOC_DETAIL_HEADER"),
        values: [
          { title: t("WS_PROP_DETAIL_CITY"), value: data?.cpt?.details?.address?.city },
          { title: t("WS_PROP_DETAIL_DHNO"), value: data?.cpt?.details?.address?.doorNo },
          { title: t("WS_PROP_DETAIL_BUILD_NAME_LABEL"), value: data?.cpt?.details?.address?.buildingName },
          { title: t("WS_PROP_DETAIL_STREET_NAME"), value: data?.cpt?.details?.address?.street },
          { title: t("WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"), value: data?.cpt?.details?.address?.locality?.name },
        ],
      },
      {
        title: t("WS_TASK_PROP_OWN_HEADER"),
        values: getOwnersforPDF(data?.cpt?.details,t),
      },
      {...application?.applicationType.includes("WATER")?{
        title: t("WS_COMMON_CONNECTION_DETAILS"),
        values: [
          {
            title: t("WS_APPLY_FOR"),
            value: application?.applicationType.includes("WATER")?t("WS_WATER"):t("WS_SEWERAGE"),
          },
          {
            title: t("WS_CONN_DETAIL_NO_OF_TAPS"),
            value: application?.proposedTaps,
          },
          {
            title: t("WS_CONN_DETAIL_PIPE_SIZE"),
            value: application?.proposedPipeSize,
          }
        ],
      }:{
        title: t("WS_COMMON_CONNECTION_DETAILS"),
        values: [
          {
            title: t("WS_APPLY_FOR"),
            value: application?.applicationType.includes("WATER")?t("WS_WATER"):t("WS_SEWERAGE"),
          },
          {
            title: t("WS_CONN_DETAIL_NO_OF_TOILETS"),
            value: application?.proposedToilets,
          },
          {
            title: t("WS_CONN_DETAIL_WATER_CLOSETS"),
            value: application?.proposedWaterClosets,
          }
        ],
      }},
      {
        title: t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER"),
        values: [
          {
            title: t("WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS"),
            value: application?.connectionHolders == null ? t("CS_YES") : t("CS_NO"),
          }
        ],
      },
      {
        title: t("WS_COMMON_DOCS"),
        values: getDocumentsForPDF(data?.documents,t),
      },
      {
        title: t("WS_COMMON_ADDN_DETAILS"),
        values: [
          {
            title: t("WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL"),
            value: application?.connectionType || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_NO_OF_TAPS"),
            value: application?.noOfTaps || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_WATER_SOURCE"),
            value: application?.waterSource || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_WATER_SUB_SOURCE"),
            value: application?.waterSource || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_PIPE_SIZE"),
            value: application?.pipeSize || "NA",
          },
        ],
      },
      {
        title: t("WS_COMMON_PLUMBER_DETAILS"),
        values: [
          {
            title: t("WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY"),
            value: application?.plumberInfo?.providedBy || "NA",
          },
          {
            title: t("WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"),
            value: application?.plumberInfo?.licenseNo || "NA",
          },
          {
            title: t("WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"),
            value: application?.plumberInfo?.name || "NA",
          },
          {
            title: t("WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"),
            value: application?.plumberInfo?.mobileNumber || "NA",
          },
        ],
      },
      {
        title: t("WS_ROAD_CUTTING_CHARGE"),
        values: [
          {
            title: t("WS_ADDN_DETAIL_ROAD_TYPE"),
            value: application?.roadType || "NA",
          },
          {
            title: t("WS_ADDN_DETAILS_AREA_LABEL"),
            value: application?.roadCuttingArea || "NA",
          }
        ],
      },
      {
        title: t("WS_ACTIVATION_DETAILS"),
        values: [
          {
            title: t("WS_SERV_DETAIL_CONN_EXECUTION_DATE"),
            value: application?.connectionExecutionDate || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_METER_ID"),
            value: application?.meterId || "NA",
          },
          {
            title: t("WS_ADDN_DETAIL_METER_INSTALL_DATE"),
            value: application?.meterInstallationDate || "NA",
          },
        ],
      },
    ],
  };
};
export const checkForEmployee = (roles) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser();
  let rolesArray = [];

  const rolearray = userInfo?.info?.roles.filter(item => {
    for (let i = 0; i < roles.length; i++) {
      if (item.code == roles[i] && item.tenantId === tenantId) rolesArray.push(true);
    }
  });

  return rolesArray?.length;
}

export const getBusinessService = (data) => {
  if (data?.service == "WATER") return "WS.ONE_TIME_FEE"
  else return "SW.ONE_TIME_FEE"
}

export const convertApplicationData = (data, serviceType) => {

  data?.propertyDetails?.owners?.forEach(owner => {
    if (owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress
  })

  let ConnectionDetails = [{
    water: serviceType === "WATER" ? true : false,
    sewerage: serviceType === "WATER" ? false : true,
    applicationNo: data?.applicationData?.applicationNo,
    serviceName: serviceType,
    proposedTaps: Number(data?.applicationData?.proposedTaps) || "",
    proposedPipeSize: data?.applicationData?.proposedPipeSize ? {
      i18nKey : data?.applicationData?.proposedPipeSize,
      code: data?.applicationData?.proposedPipeSize,
      size: data?.applicationData?.proposedPipeSize
    } : "",
    proposedToilets: data?.applicationData?.noOfToilets || "",
    proposedWaterClosets: data?.applicationData?.noOfWaterClosets || ""
  }];


  const ConnectionHolderDetails = data?.applicationData?.connectionHolders?.length > 0 ? [{
    sameAsOwnerDetails: false,
    name: data?.applicationData?.connectionHolders?.[0]?.name || "",
    mobileNumber: data?.applicationData?.connectionHolders?.[0]?.mobileNumber || "",
    guardian: data?.applicationData?.connectionHolders?.[0]?.fatherOrHusbandName || "",
    address: data?.applicationData?.connectionHolders?.[0]?.correspondenceAddress || "",
    gender: data?.applicationData?.connectionHolders?.[0]?.gender ? {
      code: data?.applicationData?.connectionHolders?.[0]?.gender,
      i18nKey : data?.applicationData?.connectionHolders?.[0]?.gender,
    } : "",
    relationship: data?.applicationData?.connectionHolders?.[0]?.relationship ?  {
      code: data?.applicationData?.connectionHolders?.[0]?.relationship,
      i18nKey: data?.applicationData?.connectionHolders?.[0]?.relationship
    } : "",
    ownerType: data?.applicationData?.connectionHolders?.[0]?.ownerType ? {
      code: data?.applicationData?.connectionHolders?.[0]?.ownerType,
      i18nKey: data?.applicationData?.connectionHolders?.[0]?.ownerType
    } : "",

    documentId: "",
    documentType: "",
    file: "",
  }] : [{
    sameAsOwnerDetails: true,
    name: "",
    gender: "",
    mobileNumber: "",
    guardian: "",
    relationship: "",
    address: "",
    ownerType: "",
    documentId: "",
    documentType: "",
    file: "",
  }];

  let documents = [];
  if (data?.applicationData?.documents) {
    data.applicationData.documents.forEach(data => {
      documents.push({
        active: true,
        code: data?.documentType,
        i18nKey: data?.documentType?.replaceAll('.', '_'),
        documentType: data?.documentType,
        id: data.id,
        documentUid: data?.documentUid,
        fileStoreId: data?.fileStoreId
      })
    })
  }
  let DocumentsRequired = {
    documents : documents
  } || [];

  let cpt = {};
  cpt["details"] = data?.propertyDetails || {};

  let payload = {
    ConnectionDetails: ConnectionDetails,
    ConnectionHolderDetails: ConnectionHolderDetails,
    DocumentsRequired: DocumentsRequired,
    cpt: cpt,
    InfoLabel: "InfoLabel"
  }

  sessionStorage.setItem("Digit.PT_CREATE_EMP_WS_NEW_FORM", JSON.stringify(payload));
  sessionStorage.setItem("WS_EDIT_APPLICATION_DETAILS", JSON.stringify(data));

  return payload;
}

export const convertEditApplicationDetails = async (data, appData) => {

  data?.cpt?.details?.owners?.forEach(owner => {
    if (owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress
  });

  let payload = {
    ...appData.applicationData,
    proposedTaps: data?.ConnectionDetails?.[0]?.proposedTaps && Number(data?.ConnectionDetails?.[0]?.proposedTaps),
    proposedPipeSize: data?.ConnectionDetails?.[0]?.proposedPipeSize?.size && Number(data?.ConnectionDetails?.[0]?.proposedPipeSize?.size),
    proposedWaterClosets: data?.ConnectionDetails?.[0]?.proposedWaterClosets && Number(data?.ConnectionDetails?.[0]?.proposedWaterClosets),
    proposedToilets: data?.ConnectionDetails?.[0]?.proposedToilets && Number(data?.ConnectionDetails?.[0]?.proposedToilets),
    connectionHolders: !data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails ? [{
      correspondenceAddress: data?.ConnectionHolderDetails?.[0]?.address || "",
      fatherOrHusbandName: data?.ConnectionHolderDetails?.[0]?.guardian || "",
      gender: data?.ConnectionHolderDetails?.[0]?.gender?.code || "",
      mobileNumber: data?.ConnectionHolderDetails?.[0]?.mobileNumber || "",
      name: data?.ConnectionHolderDetails?.[0]?.name || "",
      ownerType: data?.ConnectionHolderDetails?.[0]?.ownerType?.code || "",
      relationship: data?.ConnectionHolderDetails?.[0]?.relationship?.code || "",
      sameAsPropertyAddress: data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails
    }] : null,
    property: data?.cpt?.details,
    processInstance: {
      action: "RESUBMIT_APPLICATION"
    },
    action: "RESUBMIT_APPLICATION",
    documents: data?.DocumentsRequired?.documents,
  }

  return payload;
}