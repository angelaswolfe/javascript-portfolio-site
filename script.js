// Navbar scroll effect using variables and conditionals
window.addEventListener('scroll', function () {
    let navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }
    // Show/hide scroll-to-top button
    let scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        if (window.scrollY > 200) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// Dark Mode Toggle using function and constant
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Save preference
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}
// On page load, set theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

const darkModeBtn = document.getElementById('darkModeToggle');
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', toggleDarkMode);
}

// Scroll to top button functionality
const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Fetch and render projects using foundational JS concepts
document.addEventListener('DOMContentLoaded', function () {
    // Helper: create a badge for each tech
    function createTechBadge(tech) {
        return `<span style="background:#e3e7fa;color:#2d3a5a;border-radius:4px;padding:3px 8px;margin:0 3px 3px 0;display:inline-block;font-size:0.9em;font-weight:500;">${tech}</span>`;
    }

    // Helper: create a project card
    function createProjectCard(project) {
        const { title, description, tech, link, image, highlights, projectUrl } = project;
        let techList = '';
        for (let i = 0; i < tech.length; i++) {
            techList += createTechBadge(tech[i]);
        }
        // Centered, non-bulleted highlights
        let highlightsList = '';
        if (Array.isArray(highlights) && highlights.length > 0) {
            highlightsList = `<div class="project-highlights d-flex flex-column align-items-center justify-content-center mb-2">`;
            for (let i = 0; i < highlights.length; i++) {
                highlightsList += `<div class="highlight-text text-center mb-1" style="font-size:1.01em;">${highlights[i]}</div>`;
            }
            highlightsList += `</div>`;
        }
        const imgSrc = image ? image : 'https://placehold.co/320x180/EEE/AAA?text=Project+Image';

        // Add a "View Project" button if projectUrl exists
        let projectBtn = '';
        if (project.projectUrl) {
            projectBtn = `
                <a href="${project.projectUrl}" target="_blank" class="w-100 mb-2">
                    <button class="btn btn-outline-secondary w-100 fw-semibold mt-2">View Project</button>
                </a>
            `;
        }

        return `
            <div class="project-card col-12 col-md-6 col-lg-4 mb-4" data-tech='${JSON.stringify(tech)}'>
                <img src="${imgSrc}" alt="${title} screenshot" class="project-image w-100 rounded-top">
                <div class="p-4 d-flex flex-column align-items-center">
                    <h4 class="fw-bold mb-2">${title}</h4>
                    <p class="mb-2">${description}</p>
                    <div class="mb-2">${techList}</div>
                    ${projectBtn}
                    <a href="${link}" target="_blank" class="w-100">
                        <button class="btn btn-primary w-100 fw-semibold mt-2">View on GitHub</button>
                    </a>
                </div>
            </div>
        `;
    }

    // Render skill filter buttons (chips)
    function renderSkillFilters(skills, activeSkills) {
        var filterContainer = document.getElementById('project-skills-filter');
        if (!filterContainer) return;
        let html = `<button class="skill-filter-btn${activeSkills.length === 0 ? ' active' : ''}" data-skill="">All</button>`;
        for (let i = 0; i < skills.length; i++) {
            const isActive = activeSkills.includes(skills[i]);
            html += `<button class="skill-filter-btn${isActive ? ' active' : ''}" data-skill="${skills[i]}">${skills[i]}</button>`;
        }
        filterContainer.innerHTML = html;
    }

    // Render projects (filtered by multiple skills) with animation
    function renderProjects(projects, filterSkills) {
        var container = document.getElementById('projects-container');
        if (!container) return;

        // Animate out old cards
        const oldCards = Array.from(container.querySelectorAll('.project-card'));
        oldCards.forEach(card => {
            card.classList.add('project-fade-out');
        });

        // After fade out, clear and add new cards
        setTimeout(function () {
            container.innerHTML = '';
            for (let i = 0; i < projects.length; i++) {
                // If no filter, show all. If filter, show if ALL selected skills are present in project.tech
                if (
                    filterSkills.length === 0 ||
                    filterSkills.every(skill => projects[i].tech.includes(skill))
                ) {
                    // Create a wrapper div for animation
                    const temp = document.createElement('div');
                    temp.innerHTML = createProjectCard(projects[i]);
                    const card = temp.firstElementChild;
                    card.classList.add('project-card');
                    container.appendChild(card);
                }
            }
        }, oldCards.length ? 250 : 0); // Only delay if there were cards to fade out
    }

    // Fetch projects.json and render
    const projectsUrl = 'projects.json';
    fetch(projectsUrl)
        .then(response => response.json())
        .then(function (projects) {
            // Gather all unique skills from the "tech" arrays in the JSON
            let skillSet = new Set();
            for (let i = 0; i < projects.length; i++) {
                if (Array.isArray(projects[i].tech)) {
                    for (let j = 0; j < projects[i].tech.length; j++) {
                        skillSet.add(projects[i].tech[j]);
                    }
                }
            }
            const allSkills = Array.from(skillSet).sort();

            // Initial render
            let activeSkills = [];
            renderSkillFilters(allSkills, activeSkills);
            renderProjects(projects, activeSkills);

            // Add event listeners for filter buttons (chips)
            document.getElementById('project-skills-filter').addEventListener('click', function (e) {
                if (e.target.classList.contains('skill-filter-btn')) {
                    const skill = e.target.getAttribute('data-skill');
                    if (!skill) {
                        // "All" clicked, clear all filters
                        activeSkills = [];
                    } else {
                        // Toggle skill in activeSkills array
                        if (activeSkills.includes(skill)) {
                            activeSkills = activeSkills.filter(s => s !== skill);
                        } else {
                            activeSkills.push(skill);
                        }
                    }
                    renderSkillFilters(allSkills, activeSkills);
                    renderProjects(projects, activeSkills);
                }
            });
        })
        .catch(function (error) {
            if (console && console.error) {
                console.error('Error loading projects:', error);
            }
        });
});

// Accessibility: Toggle dark mode with Ctrl+D or Cmd+D
document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault(); // Prevent browser bookmark shortcut
        toggleDarkMode();
    }
});

// Navigation Highlighting (Scrollspy)
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const sections = Array.from(document.querySelectorAll('section[id]'));

    function onScroll() {
        let scrollPos = window.scrollY + 100; // Offset for navbar height
        let currentSectionId = '';
        for (let section of sections) {
            if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
                currentSectionId = section.id;
                break;
            }
        }
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll(); // Run on load
});
