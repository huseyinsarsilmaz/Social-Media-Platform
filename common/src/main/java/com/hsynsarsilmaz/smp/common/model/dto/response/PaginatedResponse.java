
package com.hsynsarsilmaz.smp.common.model.dto.response;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedResponse<T> {
    private List<T> content;
    private int page;
    private boolean last;
    private long totalElements;

    public PaginatedResponse(Page<T> page) {
        this.content = page.getContent();
        this.page = page.getNumber();
        this.last = page.isLast();
        this.totalElements = page.getTotalElements();

    }

}
