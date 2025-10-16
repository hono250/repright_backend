[@concept-design-overview](../background/concept-design-overview.md)

# question: why should concepts be modular?


# response:

The provided text emphasizes modularity as a foundational principle of concept design, stating that it breaks functionality into "separable, modular services called *concepts*." This modularity is crucial for several key reasons:

1.  **Improved Separation of Concerns:** Modularity ensures that each concept addresses only a single, coherent aspect of an application's functionality. This prevents the conflation of different concerns (e.g., user authentication, profile, and notification being combined in a single `User` class in traditional designs). This separation leads to simpler and more robust designs and implementations.

2.  **Enhanced Understandability and Simplicity:**
    *   **For Developers:** Each concept can be "specified, implemented and understood separately." This reduces cognitive load, as developers don't need to grasp the entire system to work on one part.
    *   **For Users:** Concepts are "independently understandable." Users can make sense of a new application because familiar concepts (like "Post" or "Upvote") are separable, so understanding one doesn't require understanding another. This also makes interactions more familiar.

3.  **Greater Recognition and Facilitation of Reusability:**
    *   Because concepts are modular and independent, they can be "reused across applications" and "instantiated multiple times within the same application."
    *   Modularity means a concept can be adopted without also needing to include other concepts it might have been tightly coupled to in a less modular design. This independence is essential for true reuse.
    *   Reusable concepts act as "repositories of design knowledge and experience," reducing work for designers and developers.

4.  **Scalability of Design and Development:**
    *   Concept independence allows design to scale because "individual concepts can be worked on by different designers or design teams, and brought together later." This enables parallel development and reduces bottlenecks.

5.  **Completeness and Reduced Dependencies:** Modular concepts are "complete with respect to their functionality and don't rely on functionality from other concepts." This ensures that each concept is self-contained and fulfills its purpose without external dependencies, further enhancing its independence and reusability.

6.  **Facilitates Composition through Synchronization:** While concepts are independent, their modularity and clear interfaces (actions) allow them to be composed effectively using "synchronizations." This mechanism explicitly defines how independent concepts interact, rather than relying on implicit or direct coupling, maintaining the benefits of modularity even when concepts work together.