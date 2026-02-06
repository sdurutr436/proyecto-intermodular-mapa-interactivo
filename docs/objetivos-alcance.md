# SMART Objectives - Transkarte

| **Objective** | **Description** |
|---------------|----------------|
| **S (Specific)** | Develop an interactive web application that combines a world map with an automatic translation system to display a word or phrase translated into the official languages of each country. |
| **M (Measurable)** | Achieve that the user can enter a word or phrase and visualize the translations of at least **50 countries** correctly on the map. |
| **A (Achievable)** | Use the MERN stack (MongoDB, Express, React, Node.js) together with existing translation APIs (such as Google Translate or LibreTranslate) and geographical visualization libraries (Leaflet or D3.js). |
| **R (Relevant)** | Facilitate intercultural understanding and language learning in a visual, intuitive and fast way, integrating map + translation in a single interface. |
| **T (Time-bound)** | Develop the functional MVP within a maximum period of **8 weeks**, including performance testing and initial deployment. |

---

# MVP (Minimum Viable Product) Definition

The **MVP** will include the following basic features:

- ✅ Search field where the user enters a word or phrase.  
- ✅ Automatic translation to the official languages of each country.  
- ✅ Display of translations by clicking on the **interactive world map**.  
- ✅ **Translation cache** system to avoid repeated calls to the API.  
- ✅ Responsive and functional web design on desktop and mobile devices.  
- ✅ Own API in Node.js that manages requests and database.

---

# Scope Delimitation

### **What the project DOES include**
- Implementation of an interactive world map (react-simple-maps).  
- Integration with an external translation API.  
- Storage of searches and translations in database (MongoDB).  
- Cache system to optimize performance.  
- Simple and intuitive user interface.  
- Functional deployment on a server.

### **What the project DOES NOT include**
- User registration and authentication.  
- Manual or human-validated translations.  
- Support for minority languages not recognized by the API.  
- Social functionalities (comments, ratings, etc.).  
- Advanced optimization for low-end devices.  
- Native mobile application (only responsive web version).

---

# Success Criteria

| **Criterion** | **Compliance Indicator** |
|--------------|-------------------------------|
| **Usability** | Users can perform a search and visualize translations without needing external help. |
| **Performance** | The system responds with translations in less than **3 seconds** on average. |
| **Stability** | The application remains operational without critical errors during prolonged sessions. |
| **Accuracy** | At least **90%** of generated translations are correct or understandable according to the language. |
| **Resource Optimization** | The system reuses stored translations, reducing requests to the external API by at least **50%**. |
| **Functional Deployment** | The MVP is publicly available and accessible from a web browser. |
