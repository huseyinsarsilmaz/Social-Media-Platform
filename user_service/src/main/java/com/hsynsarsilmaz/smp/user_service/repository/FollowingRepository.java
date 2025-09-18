package com.hsynsarsilmaz.smp.user_service.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

import org.springframework.data.domain.Page;

import com.hsynsarsilmaz.smp.user_service.model.entity.Following;

@Repository
public interface FollowingRepository extends JpaRepository<Following, Long> {
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);

    Optional<Following> findByFollowerIdAndFollowingId(Long followerId, Long followingId);

    @EntityGraph(attributePaths = "following")
    Page<Following> findByFollowerId(Long followerId, Pageable pageable);

    @EntityGraph(attributePaths = "follower")
    Page<Following> findByFollowingId(Long followingId, Pageable pageable);
}
