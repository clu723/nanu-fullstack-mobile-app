## Log In Accounts  
### There are pre-made accounts that you can log in to test the app. 
* Patients:   
  * User1  
    * Email: user1@example.com
    * Password: 123456  
  * User2  
    * Email: user1@example.com
    * Password: 123456  
* Experts:  
  * Email: expert@example.com
  * Password: 123456


## Data Structure & Approach
* Settings Tree  
  * Settings are stored as a JSON tree in Firestore under each patient’s document (patients/{uid}/settingsTree).  
  * The checkboxes tree is then recursively built from objects, where each key is a setting or category, and leaf nodes are booleans.  
  * The UI uses a TreeNode structure:  
    * id: Unique path identifier (e.g., "General.Notifications").  
    * label: Display name.  
    * children: Array of child nodes (for branches).  
  * Checkbox state is managed in a CheckboxesMap (Record\<string, boolean\>), mapping each node’s id to its checked status.  
* Toggle Logic  
  * Precomputed Maps:  
    * The tree structure is indexed with maps (parentMap, byId) for O(1) access to parent and node data, minimizing traversal overhead during toggling.  
  * Descendant Updates:  
    * When toggling a parent checkbox, the algorithm recursively updates all descendants in O(N) time, where N is the number of descendants. This is achieved by traversing the subtree rooted at the toggled node.  
  * Ancestor Updates:  
    * When toggling a child node, the algorithm “bubbles up” changes to ancestors using the parent map. For each ancestor, it checks the state of all its children in O(C) time per ancestor, where C is the number of children.   
  * Overall Complexity:  
    * Toggling a checkbox (parent or child) is O(D \+ A × C), where D is the number of descendants and A is the number of ancestors up to the root, each with C children.


## Performance Notes & Enhancements
* Parent-child relationships are precomputed for O(1) access during toggling.  
* Settings are saved to Firestore only when the user logs out or the app goes to the background/inactive state, reducing unnecessary writes.  
* Lazy Loading:  
  * Patient settings and logs are loaded asynchronously on page mount
