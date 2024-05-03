package org.egov.user.domain.service.utils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.web.contract.MessagesResponse;
import org.egov.web.controller.MessageController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

//import static org.reflections.Reflections.log;

@Component
@Slf4j

public class LocalizationUtil {

    @Value("${state.level.tenant.id}")
    private String tenantId;
    @Value("${egov.localization.module}")
    private String module;
    @Value("${egov.localization.default.locale}")
    private String defaultLocale;
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    @Lazy
    private MessageController messageController;

    public String getLocalizedMessage(String code, String locale, RequestInfo requestInfo) {
        if(locale == null)
            locale = defaultLocale;
//        String uri = getUri(locale);
//        Object responseobj = restTemplate.postForObject(uri, requestInfo, Map.class);
//        Object object = JsonPath.read(responseobj,
//                "$.messages[?(@.code==\"" + code + "\")].message");
//        List<String> messages = (ArrayList<String>) object;
        
        //CHANGE: Light Weight Digit
        MessagesResponse response = messageController.getMessages(locale, module, tenantId, new HashSet<>(Arrays.asList(code)));
        List<String> messages = response.getMessages().stream().map(msg -> msg.getMessage()).collect(Collectors.toList());
        
        String message = messages.get(0);
        return message;
    }

//    String getUri(String locale) {
//        return localizationServiceHost + localizationServiceSearchPath + "?locale=" + locale + "&tenantId=" + tenantId + "&module=" + module;
//    }

}
