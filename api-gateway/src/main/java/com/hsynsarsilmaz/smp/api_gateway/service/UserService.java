package com.hsynsarsilmaz.smp.api_gateway.service;

import com.hsynsarsilmaz.smp.api_gateway.model.entity.User;

public interface UserService {

    public User getByEmail(String email);
}
