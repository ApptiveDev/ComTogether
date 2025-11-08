package com.cmg.comtogether.glossary.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(indexName = "glossary")
@Setting(settingPath = "/elasticsearch/glossary-settings.json")
public class GlossaryDocument {

    @Id
    private String id;

    @MultiField(
            mainField = @Field(type = FieldType.Text, analyzer = "glossary_name_analyzer"),
            otherFields = {
                    @InnerField(suffix = "auto_complete", type = FieldType.Search_As_You_Type),
                    @InnerField(suffix = "raw", type = FieldType.Keyword)
            }
    )
    private String name;

    @Field(type = FieldType.Keyword)
    private String description;
}
