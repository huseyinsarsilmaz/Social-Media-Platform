package com.hsynsarsilmaz.smp.post_service.repository;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    boolean existsByUserIdAndTypeAndRepostOfId(Long userId, Post.Type type, Long repostOfId);

    Optional<Post> findByUserIdAndTypeAndRepostOfId(Long userId, Post.Type type, Long repostOfId);

    @Query("select p.id from Post p where p.parentId = :parentId")
    List<Long> findIdsByParentId(@Param("parentId") Long parentId);

    int countByParentId(Long parentId);

    int countByRepostOfIdOrQuoteOfId(Long repostOfId, Long quoteOfId);

    @Query("SELECT p.parentId AS postId, COUNT(p) AS count " +
                    "FROM Post p " +
                    "WHERE p.parentId IN :postIds " +
                    "GROUP BY p.parentId")
    List<PostCount> countByParentIdIn(@Param("postIds") List<Long> postIds);

    @Query("SELECT p.repostOfId AS postId, COUNT(p) AS count " +
                    "FROM Post p WHERE p.repostOfId IN :postIds GROUP BY p.repostOfId")
    List<PostCount> countRepostsByPostIds(@Param("postIds") List<Long> postIds);

    @Query("SELECT p.quoteOfId AS postId, COUNT(p) AS count " +
                    "FROM Post p WHERE p.quoteOfId IN :postIds GROUP BY p.quoteOfId")
    List<PostCount> countQuotesByPostIds(@Param("postIds") List<Long> postIds);

    @Query("SELECT p.repostOfId FROM Post p WHERE p.userId = :userId AND p.repostOfId IN :postIds")
    Set<Long> findRepostedParentIdsByUser(@Param("userId") Long userId, @Param("postIds") List<Long> postIds);

}
