package org.egov.user.persistence.repository;

import org.egov.access.web.contract.action.ActionContract;
import org.egov.access.web.contract.action.ActionRequest;
import org.egov.access.web.contract.action.ActionResponse;
import org.egov.access.web.controller.ActionController;
import org.egov.common.contract.request.RequestInfo;
import org.egov.user.domain.model.Action;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActionRestRepository {

    private RestTemplate restTemplate;
    private String url;
    @Value("${egov.mdms.actions}")
    private String actionFile;

    public ActionRestRepository(final RestTemplate restTemplate
//                                @Value("${egov.services.accesscontrol.host}") final String accessControlHost,
//                                @Value("${egov.services.accesscontrol.action_search}") final String url
                                ) {
        this.restTemplate = restTemplate;
//        this.url = accessControlHost + url;
    }

    /**
     * get the list of Actions based on RoleCodes and tenantId from access-control
     *
     * @param roleCodes
     * @param tenantId
     * @return
     * @throws JSONException 
     * @throws UnsupportedEncodingException 
     */
    public List<Action> getActionByRoleCodes(final List<String> roleCodes, String tenantId) throws UnsupportedEncodingException, JSONException {
        String actionFileName = "";
        actionFileName = actionFile;
        ActionRequest actionRequest = ActionRequest.builder()
                .requestInfo(new RequestInfo())
                .roleCodes(roleCodes)
                .tenantId(tenantId)
                .actionMaster(actionFileName)
                .build();

//        final ActionResponse actionResponse = restTemplate.postForObject(url, actionRequest, ActionResponse.class);
        //CHANGE: lightweight Digit
        ActionController actionController = new ActionController();
        final ActionResponse actionResponse = actionController.getActionsBasedOnRoles(actionRequest);
        return actionRequest.getActions().stream()
        	.map(ac -> {return Action.builder().name(ac.getName()).url(ac.getUrl()).displayName(ac.getDisplayName()).orderNumber(ac.getOrderNumber())
                .queryParams(ac.getQueryParams()).parentModule(ac.getParentModule()).serviceCode(ac.getServiceCode()).build();}).collect(Collectors.toList());
//        return actionResponse.toDomainActions();
    }

}
