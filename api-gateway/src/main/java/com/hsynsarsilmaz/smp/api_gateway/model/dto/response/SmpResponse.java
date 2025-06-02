package com.hsynsarsilmaz.smp.api_gateway.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SmpResponse<T> {

    private boolean status;
    private String message;
    private T data;

}
