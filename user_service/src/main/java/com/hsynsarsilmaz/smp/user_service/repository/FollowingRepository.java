package com.hsynsarsilmaz.smp.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hsynsarsilmaz.smp.user_service.model.entity.Following;

@Repository
public interface FollowingRepository extends JpaRepository<Following, Long> {

}
