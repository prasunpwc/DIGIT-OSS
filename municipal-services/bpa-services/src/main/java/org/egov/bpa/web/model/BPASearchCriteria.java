package org.egov.bpa.web.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BPASearchCriteria {

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("ids")
    private List<String> ids;

    @JsonProperty("status")
    private String status;

    @JsonProperty("edcrNumber")
    private String edcrNumber;

    @JsonProperty("applicationNo")
    private String applicationNo;

    @JsonProperty("approvalNo")
    private String approvalNo;

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("landId")
    @JsonIgnore
    private List<String> landId;

    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit;

    @JsonProperty("approvalDate")
    private Long approvalDate;

    @JsonProperty("fromDate")
    private Long fromDate;

    @JsonProperty("toDate")
    private Long toDate;

    @JsonIgnore
    private List<String> ownerIds;

    @JsonProperty("businessService")
    @JsonIgnore
    private List<String> businessService;

    @JsonProperty("createdBy")
    @JsonIgnore
    private List<String> createdBy;

    @JsonProperty("locality")
    private String locality;

    public boolean isEmpty() {
        return (this.tenantId == null && this.status == null && this.ids == null && this.applicationNo == null
                && this.mobileNumber == null && this.landId == null && this.edcrNumber == null && this.approvalNo == null
                && this.approvalDate == null && this.ownerIds == null
                && this.businessService == null && this.locality == null);
    }

    public boolean tenantIdOnly() {
        return (this.tenantId != null && this.status == null && this.ids == null && this.applicationNo == null
                && this.mobileNumber == null && this.landId == null && this.edcrNumber == null && this.approvalNo == null
                && this.approvalDate == null && this.ownerIds == null
                && this.businessService == null && this.locality == null);
    }
}
