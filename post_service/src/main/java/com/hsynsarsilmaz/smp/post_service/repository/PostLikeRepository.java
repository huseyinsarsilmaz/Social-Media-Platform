package com.hsynsarsilmaz.smp.post_service.repository;

import java.util.List;
import java.util.Optional;

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

    @Query("SELECT pl.postId AS postId, COUNT(pl.id) AS count " +
            "FROM PostLike pl WHERE pl.postId IN :postIds " +
            "GROUP BY pl.postId")
    List<PostLikeCount> countByPostIdIn(@Param("postIds") List<Long> postIds);
}
