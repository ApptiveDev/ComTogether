package com.cmg.comtogether.glossary.repository;

import com.cmg.comtogether.glossary.entity.GlossaryDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlossaryRepository extends ElasticsearchRepository<GlossaryDocument, String> {
}
