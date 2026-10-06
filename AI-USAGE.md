## 1\. How I used AI

**\[ September 27, 2026 \], Tool:** Claude  
**\- what you asked it for:** A navigation bar, with pre-determined values and stylistic choices  
**\- what it gave back:** navigation bar styling in CSS  
**\- what you kept, what you changed, and why**: kept the whole product since it delivers an average navbar with minimal styling.  
**\- a link to the commit where that work landed:** [https\://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8](https://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8) 

**\[ September 28, 2026 \], Tool:** Claude  
**\- what you asked it for:** Changing the timer from seconds to minutes  
**\- what you kept, what you changed, and why**: Kept it at that commit, but changed it later on into a dropdown timer selection with custom timers for specific ones, in order for the recipe editing/creation process to be faster.  
**\- a link to the commit where that work landed:** [https\://github.com/Mistmane31/Right-On-Queue/commit/968da64b35ece8021a3e6167d48aa4503f831220](https://github.com/Mistmane31/Right-On-Queue/commit/968da64b35ece8021a3e6167d48aa4503f831220) 

**\[ September 29, 2026 \], Tool:** Claude  
**\- what you asked it for:** The login page does not show after running the system, so I asked for a diagnosis and a resolution.  
**\- what it gave back:** removed lines in order to require the user to login afterwards.  
**\- what you kept, what you changed, and why**: kept the whole product since it does not entail any further complications or misunderstanding toward the given prompt’s rewiring of app logic.  
**\- a link to the commit where that work landed:** [https\://github.com/Mistmane31/Right-On-Queue/commit/7c5bf2d0dd939208092aea06f53a594474723193\#diff-3d74dddefb6e35fbffe3c76ec0712d5c416352d9449e2fcc8210a9dee57dff67](https://github.com/Mistmane31/Right-On-Queue/commit/7c5bf2d0dd939208092aea06f53a594474723193#diff-3d74dddefb6e35fbffe3c76ec0712d5c416352d9449e2fcc8210a9dee57dff67) 

**\[ September 30, 2026 \], Tool:** Claude  
**\- what you asked it for:** A preview page for the recipe.  
**\- what it gave back:**   
\<div className="recipe-card-page\_\_preview"\>  
        \<h2 className="text-heading-1"\>Preview\</h2\>  
**\- what you kept, what you changed, and why**: kept the whole product since what it only edited was the jsx file, the styling choices were made by me.  
**\- a link to the commit where that work landed:** [https\://github.com/Mistmane31/Right-On-Queue/commit/cb006fe0bbee5bb38120636e59304b75f324fed7b](https://github.com/Mistmane31/Right-On-Queue/commit/cb006fe0bbee5bb38120636e59304b75f324fed7b) 

**\[ October 3, 2026 \], Tool:** Claude  
**\- what you asked it for:** A standard of casing for headings  
**\- what it gave back:** A text.js within the lib directory to capitalize recipe names, specifically: if, before, it was “Ube halaya,” it now displays it as “Ube Halaya”  
**\- what you kept, what you changed, and why**: kept the whole product since it does exactly as I prompted.  
**\- a link to the commit where that work landed:** [https\://github.com/Mistmane31/Right-On-Queue/commit/0d77a1de854a29eee89ba838db7a6b27e1a09751\#diff-27f8e44354dfd436c179ae674e1232413269d31cfae2b4b17c7c925becde17ae](https://github.com/Mistmane31/Right-On-Queue/commit/0d77a1de854a29eee89ba838db7a6b27e1a09751#diff-27f8e44354dfd436c179ae674e1232413269d31cfae2b4b17c7c925becde17ae) 

**\[ October 4, 2026 \], Tool:** Claude  
**\- what you asked it for:** To fix the error in building my queue for the recipe  
**\- what it gave back:** removed the useRef lines  
**\- what you kept, what you changed, and why**: kept the whole product since upon comparing the queue build-up with and without the lines removed, the one without the lines significantly made the queue faster, whilst the one with was stuck mid-process.  
**\- a link to the commit where that work landed:** [https\://github.com/Mistmane31/Right-On-Queue/commit/3a403529f7d4dd9caf306ca6f8014d86199f8f2d\#diff-d8c018b5d90b79a19d6b4b5f6243fa0dd611ce2325850b3dc191fac848fc00e6](https://github.com/Mistmane31/Right-On-Queue/commit/3a403529f7d4dd9caf306ca6f8014d86199f8f2d#diff-d8c018b5d90b79a19d6b4b5f6243fa0dd611ce2325850b3dc191fac848fc00e6) 

## 2\. Where the AI got it wrong 

**\[ September 27, 2026 \], Tool:** Claude  
**\- what it gave you:** An initial login of a passwordless email authentication.  
**\- what was wrong with it:** It is not aligned with what I had envisioned (username, instead of email, and password only)  
**\- what you did instead**: Asked for simpler security, username \+ password only.   
**\- a link to the commit where that work landed:** [https\://github.com/Mistmane31/Right-On-Queue/commit/2ce6fa30e09793d2ca910281a6c40f16edc77aeb](https://github.com/Mistmane31/Right-On-Queue/commit/2ce6fa30e09793d2ca910281a6c40f16edc77aeb) 

**\[ September 30, 2026 \], Tool:** Claude  
**\- what it gave you:** A queue page that does not double the steps in the display (former bug)  
**\- what was wrong with it:** the Queue page now does not respond at all—stuck at the “Building your queue…” screen  
**\- what you did instead**: Asked for a faster building time, which it then removed the lines that only confirm the doubling of steps were not conducted and do not really build the queue afterwards.  
**\- a link to the commit where that work landed:** [https\://github.com/Mistmane31/Right-On-Queue/commit/3a403529f7d4dd9caf306ca6f8014d86199f8f2d\#diff-d8c018b5d90b79a19d6b4b5f6243fa0dd611ce2325850b3dc191fac848fc00e6](https://github.com/Mistmane31/Right-On-Queue/commit/3a403529f7d4dd9caf306ca6f8014d86199f8f2d#diff-d8c018b5d90b79a19d6b4b5f6243fa0dd611ce2325850b3dc191fac848fc00e6) 

**\[ October 4, 2026 \], Tool:** Claude  
**\- what you asked it for:** To give additional shadow to some cards  
**\- what was wrong with it:** gave the login page’s card a shadow that’s light  
**\- what you did instead**: removed it. The lighting’s wrong and it could have been better if I had done it myself.   
**\- a link to the commit where that work landed:** [https\://github.com/Mistmane31/Right-On-Queue/commit/60261403eac005626d674a21b9e84c36f999fd74](https://github.com/Mistmane31/Right-On-Queue/commit/60261403eac005626d674a21b9e84c36f999fd74) 

## 3\. Who wrote what 

**Directory/Repo:** Right-On-Queue  
**Commit history to support:** [https\://github.com/Mistmane31/Right-On-Queue/commit/2ce6fa30e09793d2ca910281a6c40f16edc77aeb](https://github.com/Mistmane31/Right-On-Queue/commit/2ce6fa30e09793d2ca910281a6c40f16edc77aeb) (my initial commit, although had only the README.md before, I pushed the next one with the default basic project template and started there.)  
**What does it do and why is it built that way:** It establishes an initial backbone for my project to start, it is built this way because it is the default project you get after running “npx create-react-app my-app” in a terminal on an empty folder.

**Directory/Repo:** LoginPage.jsx  
**Commit history to support:** [https\://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8](https://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8) (upon browsing the files under components)  
**What does it do and why is it built that way:** It is the very first page the user sees on the screen, it authenticates/validates the user if they are already signed in or not, and enables them to create one if they have not done so. It is built in a way how I initially thought its logic would go (of course, further down the commit history, some changes are seen).

**Directory/Repo:** HomePage.jsx  
**Commit history to support:** [https\://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8](https://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8) (upon browsing the files under components)  
**What does it do and why is it built that way:** It basically takes over the screen after successfully logging in. It displays the recipes the logged user created, it shows the option to logout or create a new recipe. I built it this way to simplify the features I planned to implement. 

**Directory/Repo:** RecipeCardPage.jsx  
**Commit history to support:** [https\://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8](https://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8) (upon browsing the files under components)  
**What does it do and why is it built that way:** It displays the selected recipe for the user to review, and gives the user the option to: edit, delete, or queue it. I built it that way in order to allow the user to have a sort of “Limbo” page before actually doing anything with the desired recipe. 

**Directory/Repo:** RecipeEditorPage.jsx  
**Commit history to support:** [https\://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8](https://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8) (upon browsing the files under components)  
**What does it do and why is it built that way:** This was a fun and stressful page to do. But basically, it is where creating and editing goes. It allows the user to choose a name, the number of steps they wish to do, and the option for them to apply a timer if they either wish to bind time with the step or if there are any time constraints for the step to be finished. In its editing mode, the user can edit the order permanently, and change necessary timers, as well as delete steps. I built it this way, being a creating and editing space, in order to simplify the system and have less screens to deal with.

**Directory/Repo:** QueuePage.jsx  
**Commit history to support:** [https\://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8](https://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8) (upon browsing the files under components)  
**What does it do and why is it built that way:** It allows the user to rearrange the order of the steps, which, unlike the editor, it just temporarily reorders them for that queuing session. It also allows them to start, pause, and/or reset the timer, and mark the step done to move onto the next step of the recipe. This is to make this page and the editor have different purposes in editing out the recipe, which reduces redundancy. 

**Directory/Repo:** App.css  
**Commit history to support:** [https\://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8](https://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8) (upon browsing the files under components)  
**What does it do and why is it built that way:** This is to style or orient the pages into the way it manifests on the screen, from the color to the organization and animation, from text to spacing, all were made here. I built it this way, not only because it is what I envisioned, but also because I want it to look, feel, and be simple as I have proposed it to be.

**The AI-written part I understand best:**  
**File:** mockData.js  
**Commit history to support:** [https\://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8](https://github.com/Mistmane31/Right-On-Queue/commit/29385cbb22994aa416214973ac736a34795d7ce8) (upon browsing the files under lib)  
**What it does, and why I kept it**: as I have said before, in my old increment report, the mockData.js file serves as a ready-made example for the user’s preview, it has a set of pre-determined, fictional details for recipes, being a guide or a marker of where things should go in my initial system. I kept it, especially in the early stages of my progress, is because before pushing it (which I only did in week 2), the preview from VSCode is all I have. I acquired sight regarding what I was building at the time, and it proved useful for me to have a reference point for initial design and app styling. 