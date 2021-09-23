package org.egov.inbox.service;

import static org.egov.inbox.util.BpaConstants.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.inbox.repository.ServiceRequestRepository;
import org.egov.inbox.web.model.InboxSearchCriteria;
import org.egov.inbox.web.model.workflow.ProcessInstanceSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BPAInboxFilterService {

	@Value("${egov.user.host}")
	private String userHost;

	@Value("${egov.user.search.path}")
	private String userSearchEndpoint;

	@Value("${egov.searcher.host}")
	private String searcherHost;

	@Value("${egov.searcher.bpa.search.path}")
	private String bpaInboxSearcherEndpoint;

	@Value("${egov.searcher.bpa.search.desc.path}")
	private String bpaInboxSearcherDescEndpoint;

	@Value("${egov.searcher.bpa.count.path}")
	private String bpaInboxSearcherCountEndpoint;

	@Value("${egov.searcher.bpa.citizen.search.path}")
	private String bpaCitizenInboxSearcherEndpoint;

	@Value("${egov.searcher.bpa.citizen.search.desc.path}")
	private String bpaCitizenInboxSearcherDescEndpoint;

	@Value("${egov.searcher.bpa.citizen.count.path}")
	private String bpaCitizenInboxSearcherCountEndpoint;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	public List<String> fetchApplicationNumbersFromSearcher(InboxSearchCriteria criteria,
			HashMap<String, String> StatusIdNameMap, RequestInfo requestInfo) {
		List<String> applicationNumbers = new ArrayList<>();
		HashMap<String, Object> moduleSearchCriteria = criteria.getModuleSearchCriteria();
		ProcessInstanceSearchCriteria processCriteria = criteria.getProcessSearchCriteria();
		Boolean isSearchResultEmpty = false;
		Boolean isMobileNumberPresent = false;
		List<String> userUUIDs = new ArrayList<>();
		List<String> citizenRoles = Collections.emptyList();
		if (moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)) {
			isMobileNumberPresent = true;
		}
		if (isMobileNumberPresent) {
			String tenantId = criteria.getTenantId();
			String mobileNumber = String.valueOf(moduleSearchCriteria.get(MOBILE_NUMBER_PARAM));
			Map<String, List<String>> userDetails = fetchUserUUID(mobileNumber, requestInfo, tenantId);
			userUUIDs = userDetails.get(USER_UUID);
			citizenRoles = userDetails.get(USER_ROLES);
			Boolean isUserPresentForGivenMobileNumber = CollectionUtils.isEmpty(userUUIDs) ? false : true;
			isSearchResultEmpty = !isMobileNumberPresent || !isUserPresentForGivenMobileNumber;
			if (isSearchResultEmpty) {
				return new ArrayList<>();
			}
		}

		if (!isSearchResultEmpty) {
			Object result = null;

			Map<String, Object> searcherRequest = new HashMap<>();
			Map<String, Object> searchCriteria = getSearchCriteria(criteria, StatusIdNameMap, requestInfo,
					moduleSearchCriteria, processCriteria, userUUIDs);
			// Paginating searcher results
			searchCriteria.put(OFFSET_PARAM, criteria.getOffset());
			searchCriteria.put(NO_OF_RECORDS_PARAM, criteria.getLimit());
			moduleSearchCriteria.put(LIMIT_PARAM, criteria.getLimit());

			searcherRequest.put(REQUESTINFO_PARAM, requestInfo);
			searcherRequest.put(SEARCH_CRITERIA_PARAM, searchCriteria);
			
			if (citizenHasStakeholderRoles(requestInfo, citizenRoles)) {
				StringBuilder uri = new StringBuilder();
				if (moduleSearchCriteria.containsKey(SORT_ORDER_PARAM)
						&& moduleSearchCriteria.get(SORT_ORDER_PARAM).equals(DESC_PARAM))
					uri.append(searcherHost).append(bpaInboxSearcherDescEndpoint);
				else
					uri.append(searcherHost).append(bpaInboxSearcherEndpoint);

				result = restTemplate.postForObject(uri.toString(), searcherRequest, Map.class);

				applicationNumbers = JsonPath.read(result, "$.BPAs.*.applicationno");
			} else {
				StringBuilder citizenUri = new StringBuilder();

				if (moduleSearchCriteria.containsKey(SORT_ORDER_PARAM)
						&& moduleSearchCriteria.get(SORT_ORDER_PARAM).equals(DESC_PARAM))
					citizenUri.append(searcherHost).append(bpaCitizenInboxSearcherDescEndpoint);
				else
					citizenUri.append(searcherHost).append(bpaCitizenInboxSearcherEndpoint);

				result = restTemplate.postForObject(citizenUri.toString(), searcherRequest, Map.class);

				List<String> citizenApplicationsNumbers = JsonPath.read(result, "$.BPAs.*.applicationno");

				applicationNumbers.addAll(citizenApplicationsNumbers);
			}

		}
		return applicationNumbers;
	}

	private Map<String, Object> getSearchCriteria(InboxSearchCriteria criteria, HashMap<String, String> StatusIdNameMap,
			RequestInfo requestInfo, HashMap<String, Object> moduleSearchCriteria,
			ProcessInstanceSearchCriteria processCriteria, List<String> userUUIDs) {
		Map<String, Object> searchCriteria = new HashMap<>();

		searchCriteria.put(TENANT_ID_PARAM, criteria.getTenantId());
		searchCriteria.put(BUSINESS_SERVICE_PARAM, processCriteria.getBusinessService());

		// Accommodating module search criteria in searcher request
		if (moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM) && !CollectionUtils.isEmpty(userUUIDs)) {
			searchCriteria.put(USERID_PARAM, userUUIDs);
		}
		if (moduleSearchCriteria.containsKey(LOCALITY_PARAM)) {
			searchCriteria.put(LOCALITY_PARAM, moduleSearchCriteria.get(LOCALITY_PARAM));
		}
		if (moduleSearchCriteria.containsKey(APPROVAL_NUMBER_PARAM)) {
			searchCriteria.put(APPROVAL_NUMBER_PARAM, moduleSearchCriteria.get(APPROVAL_NUMBER_PARAM));
		}
		if (moduleSearchCriteria.containsKey(BPA_APPLICATION_NUMBER_PARAM)) {
			searchCriteria.put(BPA_APPLICATION_NUMBER_PARAM, moduleSearchCriteria.get(BPA_APPLICATION_NUMBER_PARAM));
		}

		// Accommodating process search criteria in searcher request
		if (!ObjectUtils.isEmpty(processCriteria.getAssignee())) {
			searchCriteria.put(ASSIGNEE_PARAM, processCriteria.getAssignee());
		}
		if (!ObjectUtils.isEmpty(processCriteria.getStatus())) {
			searchCriteria.put(STATUS_PARAM, processCriteria.getStatus());
		} else {
			if (StatusIdNameMap.values().size() > 0) {
				if (CollectionUtils.isEmpty(processCriteria.getStatus())) {
					searchCriteria.put(STATUS_PARAM, StatusIdNameMap.keySet());
				}
			}
		}
		return searchCriteria;
	}

	public Integer fetchApplicationCountFromSearcher(InboxSearchCriteria criteria,
			HashMap<String, String> StatusIdNameMap, RequestInfo requestInfo) {
		Integer totalCount = 0;
		HashMap<String, Object> moduleSearchCriteria = criteria.getModuleSearchCriteria();
		ProcessInstanceSearchCriteria processCriteria = criteria.getProcessSearchCriteria();
		Boolean isSearchResultEmpty = false;
		Boolean isMobileNumberPresent = false;
		List<String> userUUIDs = new ArrayList<>();
		if (moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)) {
			isMobileNumberPresent = true;
		}
		List<String> citizenRoles = Collections.emptyList();
		if (isMobileNumberPresent) {
			String tenantId = criteria.getTenantId();
			String mobileNumber = String.valueOf(moduleSearchCriteria.get(MOBILE_NUMBER_PARAM));
			Map<String, List<String>> userDetails = fetchUserUUID(mobileNumber, requestInfo, tenantId);
			userUUIDs = userDetails.get(USER_UUID);
			citizenRoles = userDetails.get(USER_ROLES);
			Boolean isUserPresentForGivenMobileNumber = CollectionUtils.isEmpty(userUUIDs) ? false : true;
			isSearchResultEmpty = !isMobileNumberPresent || !isUserPresentForGivenMobileNumber;
			if (isSearchResultEmpty) {
				return 0;
			}
		}

		if (!isSearchResultEmpty) {
			Object result = null;

			Map<String, Object> searcherRequest = new HashMap<>();
			Map<String, Object> searchCriteria = getSearchCriteria(criteria, StatusIdNameMap, requestInfo,
					moduleSearchCriteria, processCriteria, userUUIDs);
			searcherRequest.put(REQUESTINFO_PARAM, requestInfo);
			searcherRequest.put(SEARCH_CRITERIA_PARAM, searchCriteria);
			if (citizenHasStakeholderRoles(requestInfo, citizenRoles)) {
				StringBuilder uri = new StringBuilder();
				uri.append(searcherHost).append(bpaInboxSearcherCountEndpoint);

				result = restTemplate.postForObject(uri.toString(), searcherRequest, Map.class);

				double count = JsonPath.read(result, "$.TotalCount[0].count");
				totalCount = (int) count;
			} else {
				StringBuilder citizenUri = new StringBuilder();
				citizenUri.append(searcherHost).append(bpaCitizenInboxSearcherCountEndpoint);

				Object citizenResult = restTemplate.postForObject(citizenUri.toString(), searcherRequest, Map.class);

				double citizenCount = JsonPath.read(citizenResult, "$.TotalCount[0].count");
				totalCount = totalCount + (int) citizenCount;
			}
		}
		return totalCount;
	}

	private Map<String, List<String>> fetchUserUUID(String mobileNumber, RequestInfo requestInfo, String tenantId) {
		Map<String, List<String>> userDetails = new ConcurrentHashMap<>();
		StringBuilder uri = new StringBuilder();
		uri.append(userHost).append(userSearchEndpoint);
		Map<String, Object> userSearchRequest = new HashMap<>();
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", CITIZEN);
		userSearchRequest.put("mobileNumber", mobileNumber);
		try {
			Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
			if (null != user) {
				// log.info(user.toString());
				userDetails.put(USER_UUID, JsonPath.read(user, "$.user.*.uuid"));
				userDetails.put(USER_ROLES, new ArrayList<>(new HashSet<>(JsonPath.read(user, "$.user.*.roles.*.code"))));
			} else {
				log.error("Service returned null while fetching user for mobile number - " + mobileNumber);
			}
		} catch (Exception e) {
			log.error("Exception while fetching user for mobile number - " + mobileNumber);
			log.error("Exception trace: ", e);
		}
		return userDetails;
	}

	private boolean citizenHasStakeholderRoles(RequestInfo requestInfo, List<String> citizenRoles) {
		if(citizenRoles.isEmpty())
			citizenRoles = requestInfo.getUserInfo().getRoles().stream().map(Role::getCode)
				.collect(Collectors.toList());
		if (!citizenRoles.isEmpty() && citizenRoles.size() > 1 && citizenRoles.contains(CITIZEN))
			return true;
		return false;
	}

}
