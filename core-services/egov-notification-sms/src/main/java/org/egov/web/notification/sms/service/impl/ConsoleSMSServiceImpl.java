package org.egov.web.notification.sms.service.impl;

import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.BaseSMSService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import lombok.extern.slf4j.Slf4j;

//@Service
@Slf4j
@ConditionalOnProperty(value = "sms.provider.class", matchIfMissing = true, havingValue = "Console")
public class ConsoleSMSServiceImpl extends BaseSMSService {

    @Override
    protected void submitToExternalSmsService(Sms sms) {
        log.info(String.format("Sending sms to %s with message '%s'",
                sms.getMobileNumber(), sms.getMessage()));

    }
}
