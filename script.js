// Select key DOM elements
const navLinks = document.querySelector('.nav-links');
const scrollElements = document.querySelectorAll(
  'section, .left, .right, .timeline-item, .feature, .contact-links a, .skill, .project-card, .frame, #about-intro, #about-sections h4, #about-sections p, #about-sections ul'
);
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const sunIconClass = 'fa-solid fa-sun';
const moonIconClass = 'fa-solid fa-moon';

// Check if an element is in view with optional offset
const elementInView = (el, offset = 100) => {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset
  );
};
// Add 'scrolled' class to show animation
const displayScrollElement = (el) => {
  el.classList.add('scrolled');
};
// Apply scroll animation to all target elements
const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 100)) {
      displayScrollElement(el);
    }
  });
};
// Dynamically create and insert project cards
function renderProjects(projects) {
  const container = document.querySelector('.project-grid');
  if (!projects || !container) return;
  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-image">
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <p class="project-tech">${project.tech.join(', ')}</p>
        <div class="project-links">
          <button><a href="${project.github}" target="_blank">GitHub</a></button>
          ${project.live ? `<button><a href="${project.live}" target="_blank">Live</a></button>` : ''}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
// Apply and store the selected theme
function setTheme(theme) {
  if (theme === 'light') {
    body.classList.add('light');
    themeToggle.innerHTML = `<i class="${moonIconClass}"></i>`;
  } else {
    body.classList.remove('light');
    themeToggle.innerHTML = `<i class="${sunIconClass}"></i>`;
  }
  localStorage.setItem('theme', theme); // Save preference
}
// Load and apply saved theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  setTheme('light');
} else {
  setTheme('dark');
}
// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});
// Fetch content from JSON file and populate DOM
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Populate home section
    document.getElementById('home-title').textContent = data.home.title;
    document.getElementById('home-intro').textContent = data.home.intro;
    document.getElementById('home-image').src = data.home.image;

    const frame = document.querySelector('.frame');
    if (frame) {
      frame.classList.add('scrolled'); // Immediately animate frame
    }

    data.home.features.forEach(feature => {
      const div = document.createElement('div');
      div.className = 'feature';
      div.textContent = feature;
      document.getElementById('home-features').appendChild(div);
    });

    data.home.links.forEach(link => {
      const a = document.createElement('a');
      a.textContent = link;
      a.href = '#';
      document.getElementById('home-links').appendChild(a);
    });

    // Populate about section
    document.getElementById('about-intro').textContent = data.about.intro;
    const aboutSectionsContainer = document.getElementById('about-sections');
    if (aboutSectionsContainer) {
      aboutSectionsContainer.innerHTML = '';
      data.about.sections.forEach(section => {
        if (section.heading) {
          const h4 = document.createElement('h4');
          h4.textContent = section.heading;
          aboutSectionsContainer.appendChild(h4);
        }
        if (section.text) {
          const p = document.createElement('p');
          p.textContent = section.text;
          aboutSectionsContainer.appendChild(p);
        }
        if (section.list) {
          const ul = document.createElement('ul');
          section.list.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
          });
          aboutSectionsContainer.appendChild(ul);
        }
      });
    }

    // Populate education timeline
    data.education.forEach(item => {
      const div = document.createElement('div');
      div.className = 'timeline-item';
      div.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-date">${item.date}</div>
        <div class="timeline-content">
          <h3>${item.degree}</h3>
          <p>${item.institution}</p>
          <p>${item.description}</p>
        </div>
      `;
      document.getElementById('education-list').appendChild(div);
    });

    // Populate skills list
    const skillsListContainer = document.getElementById('skills-list');
    if (skillsListContainer) {
      data.skills.forEach(skill => {
        const div = document.createElement('div');
        div.className = 'skill';
        div.innerHTML = `
          <label>${skill.name}</label>
          <input type="range" min="0" max="100" value="${skill.level}" disabled>
        `;
        skillsListContainer.appendChild(div);
      });
    }

    // Populate projects section
    document.getElementById('projects-title').textContent = data.projects.title;
    renderProjects(data.projects.items);

    // Populate contact section
    document.getElementById('contact-title').textContent = data.contact.title;
    document.getElementById('contact-form').action = data.contact.formAction;
    const contactLinksContainer = document.getElementById('contact-links');
    if (contactLinksContainer) {
      data.contact.methods.forEach(method => {
        const a = document.createElement('a');
        a.href = method.href;
        a.target = '_blank';
        a.textContent = method.text;
        contactLinksContainer.appendChild(a);
      });
    }
  });

// Apply scroll animation on page load and on scroll
window.addEventListener('scroll', handleScrollAnimation);
handleScrollAnimation(); // Initial call in case elements are in view from the start
