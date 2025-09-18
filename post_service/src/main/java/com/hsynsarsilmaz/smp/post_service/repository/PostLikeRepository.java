package com.hsynsarsilmaz.smp.post_service.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hsynsarsilmaz.smp.post_service.model.entity.PostLike;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostIdAndUserId(Long postId, Long userId);

    Boolean existsByPostIdAndUserId(Long postId, Long userId);

    int countByPostId(Long postId);

    List<PostLike> findByPostIdIn(List<Long> postIds);

    @Query("SELECT l.postId AS postId, COUNT(l) AS count " +
            "FROM PostLike l " +
            "WHERE l.postId IN :postIds " +
            "GROUP BY l.postId")
    List<PostCount> countByPostIdIn(@Param("postIds") List<Long> postIds);

    @Query("SELECT l.postId FROM PostLike l WHERE l.userId = :userId AND l.postId IN :postIds")
    Set<Long> findPostIdsByUserIdAndPostIdIn(@Param("userId") Long userId, @Param("postIds") List<Long> postIds);

}
