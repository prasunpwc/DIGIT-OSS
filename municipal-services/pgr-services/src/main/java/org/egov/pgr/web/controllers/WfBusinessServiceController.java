package org.egov.pgr.web.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.wf.service.BusinessMasterService;
import org.egov.wf.util.ResponseInfoFactory;
import org.egov.wf.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/egov-wf")
public class WfBusinessServiceController {

	@Autowired
	@Lazy
    private BusinessMasterService businessMasterService;

	@Autowired
	@Lazy
    private ResponseInfoFactory wfResponseInfoFactory;

	@Autowired
    private ObjectMapper mapper;

//    @Autowired
//    public BusinessServiceController(BusinessMasterService businessMasterService, ResponseInfoFactory responseInfoFactory,
//                                     ObjectMapper mapper) {
//        this.businessMasterService = businessMasterService;
//        this.responseInfoFactory = responseInfoFactory;
//        this.mapper = mapper;
//    }


    /**
     * Controller for creating BusinessService
     * @param businessServiceRequest The BusinessService request for create
     * @return The created object
     */
    @RequestMapping(value="/businessservice/_create", method = RequestMethod.POST)
    public ResponseEntity<BusinessServiceResponse> create(@RequestBody @Valid BusinessServiceRequest businessServiceRequest) {
        List<BusinessService> businessServices = businessMasterService.create(businessServiceRequest);
        BusinessServiceResponse response = BusinessServiceResponse.builder().businessServices(businessServices)
                .responseInfo(wfResponseInfoFactory.createResponseInfoFromRequestInfo(businessServiceRequest.getRequestInfo(),true))
                .build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


    /**
     * Controller for searching BusinessService api
     * @param searchCriteria Object containing the search params
     * @param requestInfoWrapper The requestInfoWrapper object containing requestInfo
     * @return List of businessServices from db based on search params
     */
    @RequestMapping(value="/businessservice/_search", method = RequestMethod.POST)
    public BusinessServiceResponse search(@Valid BusinessServiceSearchCriteria searchCriteria,
                                                          @Valid RequestInfoWrapper requestInfoWrapper) {

        List<BusinessService> businessServices = businessMasterService.search(searchCriteria);
        BusinessServiceResponse response = BusinessServiceResponse.builder().businessServices(businessServices)
                .responseInfo(wfResponseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(),true))
                .build();
        return response;
    }

    @RequestMapping(value="/businessservice/_update", method = RequestMethod.POST)
    public ResponseEntity<BusinessServiceResponse> update(@Valid @RequestBody BusinessServiceRequest businessServiceRequest) {
        List<BusinessService> businessServices = businessMasterService.update(businessServiceRequest);
        BusinessServiceResponse response = BusinessServiceResponse.builder().businessServices(businessServices)
                .responseInfo(wfResponseInfoFactory.createResponseInfoFromRequestInfo(businessServiceRequest.getRequestInfo(),true))
                .build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

}
