package org.egov.id.api;

import javax.validation.Valid;

import org.egov.id.model.IdGenerationRequest;
import org.egov.id.model.IdGenerationResponse;
import org.egov.id.service.IdGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class IdGeneration {
	
	@Autowired
	IdGenerationService idGenerationService;
	
	public IdGenerationResponse generateIdResponse(
			@Valid IdGenerationRequest idGenerationRequest)
			throws Exception {

		IdGenerationResponse idGenerationResponse = idGenerationService
				.generateIdResponse(idGenerationRequest);

		return idGenerationResponse;
	}

}
