package com.noodleverse.repository;

import com.noodleverse.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.cuisine) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.country) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.noodleType) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:cuisine IS NULL OR :cuisine = 'All' OR LOWER(p.cuisine) = LOWER(:cuisine)) AND " +
           "(:noodleType IS NULL OR :noodleType = 'All' OR LOWER(p.noodleType) = LOWER(:noodleType)) AND " +
           "(:dietType IS NULL OR :dietType = 'All' OR p.dietType = :dietType) AND " +
           "(:spiceLevel IS NULL OR :spiceLevel = 'All' OR p.spiceLevel = :spiceLevel) " +
           "ORDER BY p.id ASC")
    List<Product> findWithFilters(
            @Param("search") String search,
            @Param("cuisine") String cuisine,
            @Param("noodleType") String noodleType,
            @Param("dietType") String dietType,
            @Param("spiceLevel") String spiceLevel
    );

    List<Product> findByCuisineIgnoreCase(String cuisine);
    List<Product> findByNoodleTypeIgnoreCase(String noodleType);
}
