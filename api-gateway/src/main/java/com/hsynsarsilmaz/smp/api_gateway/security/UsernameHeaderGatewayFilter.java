package com.hsynsarsilmaz.smp.api_gateway.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
public class UsernameHeaderGatewayFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;

        String username = (String) request.getAttribute("X-USERNAME");

        if (username != null) {
            HttpServletRequest wrapped = new HttpServletRequestWrapper(request) {
                @Override
                public String getHeader(String name) {
                    if ("X-USERNAME".equalsIgnoreCase(name)) {
                        return username;
                    }
                    return super.getHeader(name);
                }

                @Override
                public Enumeration<String> getHeaders(String name) {
                    if ("X-USERNAME".equalsIgnoreCase(name)) {
                        return Collections.enumeration(Collections.singletonList(username));
                    }
                    return super.getHeaders(name);
                }

                @Override
                public Enumeration<String> getHeaderNames() {
                    List<String> names = Collections.list(super.getHeaderNames());
                    if (!names.contains("X-USERNAME")) {
                        names.add("X-USERNAME");
                    }
                    return Collections.enumeration(names);
                }
            };

            chain.doFilter(wrapped, res);
        } else {
            chain.doFilter(req, res);
        }
    }
}
