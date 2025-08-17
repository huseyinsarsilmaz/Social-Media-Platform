package com.hsynsarsilmaz.smp.post_service.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hsynsarsilmaz.smp.post_service.model.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByUserId(Long userId, Pageable pageable);

    Page<Post> findByUserIdAndTypeNot(Long userId, Post.Type type, Pageable pageable);

    Page<Post> findByTypeNot(Post.Type type, Pageable pageable);

    boolean existsByUserIdAndTypeAndRepostOfId(Long userId, Post.Type type, Long repostOfId);

    int countByParentId(Long parentId);

    int countByRepostOfIdOrQuoteOfId(Long repostOfId, Long quoteOfId);

}
