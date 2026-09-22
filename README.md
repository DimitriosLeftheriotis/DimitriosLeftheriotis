# Dimitrios Leftheriotis — Personal Portfolio                                                                                                                                               
                                                                                                                                                                                              
  🌐 **Live Website:** [dimitriosleftheriotis.github.io](https://dimitriosleftheriotis.github.io/)                                                                                            
                                                                                                                                                                                              
  A fast, accessible, dependency-free academic and engineering portfolio showcasing research projects in applied AI, local LLM tooling, and computational modeling.                           
                                                                                                                                                                                              
  ---                                                                                                                                                                                         
                                                                                                                                                                                              
  ## 🛠️ Built With                                                                                                                                                                            
                                                                                                                                                                                              
  - **HTML5**: Semantic landmarks, accessible headings, and SEO/OpenGraph metadata                                                                                                            
  - **Modern CSS**: Custom property design tokens, dark/light theme switching, WCAG AA contrast compliance, responsive layouts                                                                
  - **Vanilla JavaScript**: Lightweight progressive enhancement (theme persistence, mobile navigation, scroll reveals)                                                                        
  - **Zero Build Steps**: Deploys directly to GitHub Pages with no dependencies or frameworks                                                                                                 
                                                                                                                                                                                              
  ---                                                                                                                                                                                         
                                                                                                                                                                                              
  ## 📁 Repository Structure                                                                                                                                                                  
                                                                                                                                                                                              
  - `index.html` — Main website markup and metadata                                                                                                                                           
  - `styles.css` — Visual design system and responsive styles                                                                                                                                 
  - `script.js` — Progressive enhancements and theme controller                                                                                                                               
  - `Biography.pdf` — Downloadable academic curriculum vitae / biography                                                                                                                      
  - `Biography.md` — Source biography markdown                                                                                                                                                
  - `tests/site.test.mjs` — Automated contract and accessibility tests                                                                                                                        
  - `.nojekyll` — Bypasses Jekyll processing on GitHub Pages                                                                                                                                  
                                                                                                                                                                                              
  ---                                                                                                                                                                                         
                                                                                                                                                                                              
  ## 💻 Local Development                                                                                                                                                                     
                                                                                                                                                                                              
  ### Preview Locally                                                                                                                                                                         
  You can serve the static files with Python's built-in server:                                                                                                                               
                                                                                                                                                                                              
  ```powershell                                                                                                                                                                               
  python -m http.server 8000                                                                                                                                                                  
                                                                                                                                                                                              
Then visit http://localhost:8000 in your browser.                                                                                                                                             
                                                                                                                                                                                              
### Run Automated Tests                                                                                                                                                                       
                                                                                                                                                                                              
Run the built-in Node test suite:                                                                                                                                                             
                                                                                                                                                                                              
  node --test tests/site.test.mjs                                                                                                                                                             
──────                                                     
