package org.egov.hrms.utils;

import java.security.SecureRandom;
import java.util.List;
import java.util.Random;

import lombok.extern.slf4j.Slf4j;
import org.egov.hrms.web.contract.EmployeeSearchCriteria;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Slf4j
@Service
public class HRMSUtils {
	
	@Value("${egov.hrms.default.pwd.length}")
	private Integer pwdLength;

	@Value("${egov.pwd.allowed.special.characters}")
	private String allowedPasswordSpecialCharacters;
	
	/**
	 * Generates random password for the user to login. Process:
	 * 1. Takes a list of parameters for password
	 * 2. Applies a random select logic and generates a password of constant length.
	 * 3. The length of the password is configurable.
	 * 
	 * @param params
	 * @return
	 */
	public String generatePassword(List<String> params) {
		StringBuilder password = new StringBuilder();
		SecureRandom random = new SecureRandom();
		params.add(allowedPasswordSpecialCharacters);
		try {
			for(int i = 0; i < params.size(); i++) {
				String param = params.get(i);
				String val;
				if(param.length() == 1)
					val = param;
				else
					val = param.split("")[random.nextInt(param.length() - 1)];
				if(val.equals(".") || val.equals("-") || val.equals(" "))
					password.append("x");
				else
					password.append(val);
				if(password.length() == pwdLength)
					break;
				else {
					if(i == params.size() - 1)
						i = 0;
				}
			}
		}catch(Exception e) {
			password.append("123456");
		}

		return password.toString().replaceAll("\\s+", "");
	}

	public boolean isAssignmentSearchReqd(EmployeeSearchCriteria criteria) {
		return (! CollectionUtils.isEmpty(criteria.getPositions()) || null != criteria.getAsOnDate()
				|| !CollectionUtils.isEmpty(criteria.getDepartments()) || !CollectionUtils.isEmpty(criteria.getDesignations()));
	}

	public String getTenantSpecificTopic(String kafkaTopic, String tenantId) {
		StringBuilder tenantSpecificTopic = new StringBuilder("");
		if(tenantId.contains("."))
			tenantSpecificTopic.append(tenantId.split("\\.")[1]);
		else
			tenantSpecificTopic.append(tenantId);
		tenantSpecificTopic.append("-");
		tenantSpecificTopic.append(kafkaTopic);
		log.info(tenantSpecificTopic.toString());
		return tenantSpecificTopic.toString();
	}

	public String replaceSchemaPlaceholderWithTenantId(String query, String stateLevelTenantId) {
		return query.replace("{{SCHEMA}}", stateLevelTenantId);
	}

	public String getStateLevelTenantId(String tenantId){
		StringBuilder stateLevelTenantId = new StringBuilder("");
		if(tenantId.contains("."))
			stateLevelTenantId.append(tenantId.split("\\.")[1]);
		else
			stateLevelTenantId.append(tenantId);

		return stateLevelTenantId.toString();
	}

}
