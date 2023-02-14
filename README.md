# The Drunken Dragon Universe Lore

Welcome to the repository containing the lore of **The Drunken Dragon Universe**, a fictional and decentralized fantasy universe. This universe is part of **The Drunken Dragon Fantasy Franchise**.

## How to Contribute

To contribute to the universe's lore, kindly fork the repository, create a branch from the `canon` main branch, add or modify records in the `./records` directory, and then create a pull request. After that, contributors with voting power can decide if the new records should be added to the universe's canon. This process also applies to alternate timelines and universes kept in branches within the repository.

Contributors to the lore can be given credit through the commit history.

For any product derived from The Drunken Dragon Franchise to become **official**, it must make a pull request with the added lore to this repository as part of the process of becoming official.

This repo allows the creation of alternate timelines by creating branches that follow the same rules as described earlier. The git system also helps in keeping a record of where the timeline branches from, as it maps directly to the commit history.

## Git Repository Usage

The use of a Git repository to manage the lore of The Drunken Dragon Universe ensures that the universe remains consistent and coherent. The use of versioning and a hierarchical structure allows for the easy addition of new facts and subtopics while ensuring that the universe remains consistent over time.

## Lore Record Definition Files

We keep track of the lore through the Lore Record Definition Files. These are YAML files with a header and a recursive list of facts from The Drunken Dragon Universe.

### Base Fact Records

To document the true facts of The Drunken Dragon Universe, we use the following YAML structure:

```yaml
document: fact-records/v1
topic: <tapic_to_describe>
context: 
- <context_for_reader>
- <context_for_reader>
facts:
- <related_true_fact>
- <related_true_fact>
subtopics:

- topic: <derived_topic>
  facts:
    - <related_true_fact>
    - <related_true_fact>
- topic: <derived_topic>
  facts:
    - <related_true_fact>
    - <related_true_fact>
- import: <file_path_to_fact-record>
- import: <file_path_to_fact-record>
```

* `document`: a header that helps our tools detect the content of the file and allows readers to understand what to expect. We use `fact-record/v1` for recording facts, `lang-grammar/v1` for documenting fictional languages' grammar, and `lang-dictionary/v1` for documenting fictional language dictionaries.

* `topic`: describes what aspect of The Drunken Dragon Universe this record describes.

* `context`: adds the minimum facts the reader or the machine should know to understand the facts contained in this document.

* `facts`: describes the topic. Each fact can be a short sentence or a detailed paragraph that adds depth and detail to the universe.

* `subtopics` field allows for the creation of a hierarchical and recursive structure for the facts. Subtopics can be created for specific aspects of the main topic, allowing for a more organized and detailed representation of the universe.

* `import` field can be used to include other files with facts or subtopics. This allows for the reuse of common facts and ensures consistency in the universe. The path must point to a valid Lore Record Definition File

#### Example 

```yaml
document: fact-records/v1
topic: The Drunken Dragon Universe
context: 
- Dates use the Varian Imperial System of meassuring years, where year 0 is the founding of the Varian Empire
facts:
- Gods exist and are morally grey.
subtopics:
- topic: The World
  facts:
  - Valia is a continent in the universe.
- import: ./magic-rules
```

### Fictional Language Grammar Records

To document the grammar of fictional languages in The Drunken Dragon Universe, we use the following YAML structure:

### Fictional Language Dictionary Records

### Versioning

To ensure compatibility and consistency, the lore records are versioned. Each record file contains a `document` field, which specifies the version of the record. This allows for the possibility of adding new versions of the same topic or subtopic, while still maintaining the previous versions in case they are needed for reference or backward compatibility.
