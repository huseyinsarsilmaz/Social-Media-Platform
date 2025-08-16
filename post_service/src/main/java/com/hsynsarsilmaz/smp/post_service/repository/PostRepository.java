package com.hsynsarsilmaz.smp.post_service.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hsynsarsilmaz.smp.post_service.model.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByUserId(Long userId, Pageable pageable);

    Page<Post> findByUserIdAndTypeNot(Long userId, Post.Type type, Pageable pageable);

    Page<Post> findByTypeNot(Post.Type type, Pageable pageable);

    @Query(value = "SELECT EXISTS (" +
            "SELECT 1 FROM post p " +
            "WHERE p.user_id = :userId " +
            "AND ((p.type = 'REPOST' AND p.repost_of_id = :postId) " +
            "  OR (p.type = 'QUOTE' AND p.quote_of_id = :postId))" +
            ")", nativeQuery = true)
    boolean existsRepostOrQuoteByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);

}
