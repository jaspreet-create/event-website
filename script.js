/* IEM Events — Enhanced JavaScript */
/* Existing event information and written UI messages are preserved. */

'use strict';

const EVENTS = [
  {
    id: 'hackiem',
    name: 'HackIEM 2026',
    date: '2026-09-26T09:00:00+05:30',
    venue: 'AIML Lab, Gurukul Campus',
    category: 'technical',
    description: '24-hour hackathon on applied machine learning. Teams of 2–4. Problem statements released at the opening ceremony; mentors available through the night.'
  },
  {
    id: 'dl-workshop',
    name: 'Hands-on Deep Learning with PyTorch',
    date: '2026-10-03T10:00:00+05:30',
    venue: 'Lab 4, Ashram Building',
    category: 'workshop',
    description: 'Two-day workshop covering tensors, autograd, CNNs and a small speech-emotion classifier. Bring a laptop; no prior PyTorch experience needed.'
  },
  {
    id: 'guest-lecture',
    name: 'Guest lecture: Large language models for Indian languages',
    date: '2026-10-10T14:30:00+05:30',
    venue: 'Seminar Hall, 2nd floor',
    category: 'lecture',
    description: 'An industry researcher discusses building and evaluating language models for low-resource Indic languages, followed by an open Q&A.'
  },
  {
    id: 'cultural-night',
    name: 'Sharod Sandhya — cultural evening',
    date: '2026-10-16T17:00:00+05:30',
    venue: 'Main Auditorium',
    category: 'cultural',
    description: 'Pre-Puja cultural evening with music, dance and drama performances by students of the department. Open to families.'
  },
  {
    id: 'robotics',
    name: 'Line-follower robotics challenge',
    date: '2026-11-07T10:00:00+05:30',
    venue: 'IoT Lab',
    category: 'technical',
    description: 'Build and race an autonomous line-following robot. Kits available on request; judging on speed, accuracy and build quality.'
  },
  {
    id: 'innovacion',
    name: 'Innovacion 2026 — annual tech fest',
    date: '2026-11-20T09:00:00+05:30',
    venue: 'Gurukul Campus, all blocks',
    category: 'technical',
    description: 'Three days of coding contests, project exhibitions, paper presentations and gaming. The biggest event on the department calendar.'
  }
];

const CATEGORY_LABELS = {
  technical: 'Technical',
  workshop: 'Workshop',
  cultural: 'Cultural',
  lecture: 'Lecture'
};

const eventList = document.getElementById('eventList');
const eventEmpty = document.getElementById('eventEmpty');
const eventSelect = document.getElementById('eventSelect');


/* =========================
   DATE FUNCTIONS
========================= */

function formatDateParts(iso) {
  const d = new Date(iso);

  return {
    day: d.toLocaleDateString('en-IN', {
      day: '2-digit'
    }),

    month: d.toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric'
    }),

    full: d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),

    time: d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
}


/* =========================
   DISPLAY EVENTS
========================= */

function renderEvents() {

  const sorted = [...EVENTS].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  eventList.innerHTML = sorted.map(ev => {

    const dt = formatDateParts(ev.date);

    return `
      <li class="event reveal" data-category="${ev.category}">

        <div class="event-date">
          <span class="day">${dt.day}</span>
          <span class="month">${dt.month}</span>
        </div>

        <div class="event-body">

          <h3>${ev.name}</h3>

          <p class="event-venue">
            ${dt.full}, ${dt.time} · ${ev.venue}
          </p>

          <p class="event-desc">
            ${ev.description}
          </p>

        </div>

        <span class="event-tag">
          ${CATEGORY_LABELS[ev.category]}
        </span>

      </li>
    `;

  }).join('');


  /* Add events to registration dropdown */

  eventSelect
    .querySelectorAll('option:not(:first-child)')
    .forEach(option => option.remove());


  sorted.forEach(ev => {

    const opt = document.createElement('option');

    const dt = formatDateParts(ev.date);

    opt.value = ev.id;

    opt.textContent =
      `${ev.name} (${dt.day} ${dt.month})`;

    eventSelect.appendChild(opt);

  });


  observeReveals();
}


/* =========================
   EVENT FILTER
========================= */

function filterEvents(category) {

  let visible = 0;

  document.querySelectorAll('.event').forEach(event => {

    const show =
      category === 'all' ||
      event.dataset.category === category;

    event.classList.toggle(
      'is-hidden',
      !show
    );

    if (show) {
      visible++;
    }

  });

  eventEmpty.hidden = visible > 0;
}


const eventFilters =
  document.getElementById('eventFilters');

if (eventFilters) {

  eventFilters.addEventListener('click', e => {

    const btn = e.target.closest('.chip');

    if (!btn) return;

    document
      .querySelectorAll('.chip')
      .forEach(c =>
        c.classList.remove('is-active')
      );

    btn.classList.add('is-active');

    filterEvents(btn.dataset.filter);

  });

}


renderEvents();


/* =========================
   COUNTDOWN
========================= */

const cd = {

  title: document.getElementById('cdTitle'),

  meta: document.getElementById('cdMeta'),

  days: document.getElementById('cdDays'),

  hours: document.getElementById('cdHours'),

  mins: document.getElementById('cdMins'),

  secs: document.getElementById('cdSecs')

};


function getNextEvent() {

  const now = Date.now();

  return [...EVENTS]

    .filter(ev =>
      new Date(ev.date).getTime() > now
    )

    .sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    )[0] || null;
}


function pad(n) {

  return String(n).padStart(2, '0');

}


function updateCountdown() {

  const next = getNextEvent();


  if (!next) {

    cd.title.textContent =
      'No upcoming events';

    cd.meta.textContent =
      'Check back next semester.';

    cd.days.textContent =
      cd.hours.textContent =
      cd.mins.textContent =
      cd.secs.textContent =
      '00';

    return;
  }


  const dt = formatDateParts(next.date);


  cd.title.textContent =
    next.name;

  cd.meta.textContent =
    `${dt.full} · ${next.venue}`;


  let diff =
    Math.max(
      0,
      new Date(next.date).getTime() -
      Date.now()
    );


  const days =
    Math.floor(diff / 86400000);

  diff -= days * 86400000;


  const hours =
    Math.floor(diff / 3600000);

  diff -= hours * 3600000;


  const mins =
    Math.floor(diff / 60000);

  diff -= mins * 60000;


  const secs =
    Math.floor(diff / 1000);


  cd.days.textContent =
    pad(days);

  cd.hours.textContent =
    pad(hours);

  cd.mins.textContent =
    pad(mins);

  cd.secs.textContent =
    pad(secs);
}


/* =========================
   KOLKATA CLOCK
========================= */

const clockEl =
  document.getElementById('clock');


function updateClock() {

  if (!clockEl) return;

  clockEl.textContent =
    new Date().toLocaleTimeString(
      'en-IN',
      {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    );
}


updateCountdown();

updateClock();


setInterval(() => {

  updateCountdown();

  updateClock();

}, 1000);


/* =========================
   DARK / LIGHT MODE
========================= */

const themeToggle =
  document.getElementById('themeToggle');

const themeIcon =
  themeToggle?.querySelector('.theme-icon');


function applyTheme(mode) {

  const dark =
    mode === 'dark';


  document.body.classList.toggle(
    'dark',
    dark
  );


  if (themeIcon) {

    themeIcon.textContent =
      dark ? '☀' : '☾';

  }


  if (themeToggle) {

    themeToggle.setAttribute(
      'aria-label',
      dark
        ? 'Switch to light mode'
        : 'Switch to dark mode'
    );

  }


  try {

    localStorage.setItem(
      'iem-theme',
      mode
    );

  } catch (_) {}

}


(function initTheme() {

  let saved = null;

  try {

    saved =
      localStorage.getItem(
        'iem-theme'
      );

  } catch (_) {}


  if (saved) {

    applyTheme(saved);

    return;

  }


  const prefersDark =
    window.matchMedia &&
    window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;


  applyTheme(
    prefersDark
      ? 'dark'
      : 'light'
  );

})();


if (themeToggle) {

  themeToggle.addEventListener(
    'click',
    () => {

      applyTheme(
        document.body.classList.contains('dark')
          ? 'light'
          : 'dark'
      );

    }
  );

}


/* =========================
   VALIDATION RULES
========================= */

const RULES = {

  name: {
    re: /^[A-Za-z][A-Za-z .'-]{1,59}$/,
    msg: 'Enter your full name (letters, spaces, dots only).'
  },

  roll: {
    re: /^\d{10}$/,
    msg: 'Roll number must be exactly 10 digits.'
  },

  email: {
    re: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
    msg: 'Enter a valid email address, e.g. name@iem.edu.in.'
  },

  phone: {
    re: /^[6-9]\d{9}$/,
    msg: 'Enter a valid 10-digit Indian mobile number.'
  }

};


/* =========================
   ERROR HANDLING
========================= */

function setError(id, message) {

  const field =
    document.getElementById(id);

  const err =
    document.getElementById(
      'err-' + id
    );


  if (field) {

    field.classList.toggle(
      'is-invalid',
      Boolean(message)
    );

  }


  if (err) {

    err.textContent =
      message || '';

  }


  return !message;
}


function validateText(id, rule) {

  const field =
    document.getElementById(id);

  if (!field) return true;


  const value =
    field.value.trim();


  if (!value) {

    return setError(
      id,
      'This field is required.'
    );

  }


  if (
    rule &&
    !rule.re.test(value)
  ) {

    return setError(
      id,
      rule.msg
    );

  }


  return setError(id, '');
}


function validateSelect(id, message) {

  const field =
    document.getElementById(id);

  if (!field) return true;


  const value =
    field.value;


  return setError(
    id,
    value ? '' : message
  );
}


/* =========================
   REGISTRATION FORM
========================= */

const regForm =
  document.getElementById('regForm');

const regStatus =
  document.getElementById('regStatus');


if (regForm) {

  regForm.addEventListener(
    'submit',
    e => {

      e.preventDefault();


      const checks = [

        validateText(
          'studentName',
          RULES.name
        ),

        validateText(
          'rollNo',
          RULES.roll
        ),

        validateSelect(
          'department',
          'Select your department.'
        ),

        validateText(
          'email',
          RULES.email
        ),

        validateText(
          'phone',
          RULES.phone
        ),

        (() => {

          const chosen =
            regForm.querySelector(
              'input[name="gender"]:checked'
            );

          return setError(
            'gender',
            chosen
              ? ''
              : 'Select an option.'
          );

        })(),

        validateSelect(
          'eventSelect',
          'Select the event you want to register for.'
        )

      ];


      if (checks.every(Boolean)) {

        const name =
          document
            .getElementById('studentName')
            .value
            .trim();


        const eventName =
          eventSelect
            .options[
              eventSelect.selectedIndex
            ]
            .text;


        regStatus.className =
          'form-status ok';


        regStatus.textContent =
          `Registered. Thanks ${name} — you're on the list for ${eventName}. A confirmation will be sent to your email.`;


        regForm.reset();


        regForm
          .querySelectorAll('.is-invalid')
          .forEach(el =>
            el.classList.remove(
              'is-invalid'
            )
          );

      }

      else {

        regStatus.className =
          'form-status bad';


        regStatus.textContent =
          'Some fields need attention. Fix the highlighted ones and submit again.';


        const firstBad =
          regForm.querySelector(
            '.is-invalid'
          );


        if (firstBad) {

          firstBad.focus();

        }

      }

    }
  );


  regForm.addEventListener(
    'input',
    e => {

      const id =
        e.target.id;


      if (
        !id ||
        !document.getElementById(
          'err-' + id
        )
      ) {

        return;

      }


      if (
        e.target.classList.contains(
          'is-invalid'
        )
      ) {

        const map = {

          studentName:
            RULES.name,

          rollNo:
            RULES.roll,

          email:
            RULES.email,

          phone:
            RULES.phone

        };


        if (map[id]) {

          validateText(
            id,
            map[id]
          );

        }

        else if (
          e.target.tagName ===
          'SELECT'
        ) {

          validateSelect(
            id,
            'This field is required.'
          );

        }

      }

    }
  );

}


/* =========================
   FEEDBACK FORM
========================= */

const fbForm =
  document.getElementById(
    'feedbackForm'
  );

const fbStatus =
  document.getElementById(
    'fbStatus'
  );


if (fbForm) {

  fbForm.addEventListener(
    'submit',
    e => {

      e.preventDefault();


      const checks = [

        validateText(
          'fbName',
          RULES.name
        ),

        validateText(
          'fbEmail',
          RULES.email
        ),

        (() => {

          const message =
            document
              .getElementById(
                'fbMessage'
              )
              .value
              .trim();


          if (!message) {

            return setError(
              'fbMessage',
              'Write a message before sending.'
            );

          }


          if (message.length < 15) {

            return setError(
              'fbMessage',
              'Message is too short — at least 15 characters.'
            );

          }


          return setError(
            'fbMessage',
            ''
          );

        })()

      ];


      if (checks.every(Boolean)) {

        fbStatus.className =
          'form-status ok';


        fbStatus.textContent =
          'Feedback sent. Thank you — the coordinators read every message.';


        fbForm.reset();

      }

      else {

        fbStatus.className =
          'form-status bad';


        fbStatus.textContent =
          'Fix the highlighted fields and send again.';

      }

    }
  );

}


/* =========================
   MOBILE NAVIGATION
========================= */

const navToggle =
  document.getElementById(
    'navToggle'
  );

const siteNav =
  document.getElementById(
    'siteNav'
  );


if (navToggle && siteNav) {

  navToggle.addEventListener(
    'click',
    () => {

      const open =
        siteNav.classList.toggle(
          'is-open'
        );


      navToggle.setAttribute(
        'aria-expanded',
        String(open)
      );


      navToggle.setAttribute(
        'aria-label',
        open
          ? 'Close menu'
          : 'Open menu'
      );

    }
  );


  siteNav
    .querySelectorAll('a')
    .forEach(a => {

      a.addEventListener(
        'click',
        () => {

          siteNav.classList.remove(
            'is-open'
          );


          navToggle.setAttribute(
            'aria-expanded',
            'false'
          );

        }
      );

    });

}


/* =========================
   CURRENT SECTION
========================= */

const sections =
  document.querySelectorAll(
    'main section[id]'
  );

const navLinks =
  siteNav?.querySelectorAll(
    'a[href^="#"]'
  ) || [];


if (
  'IntersectionObserver'
  in window
) {

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            !entry.isIntersecting
          ) {

            return;

          }


          navLinks.forEach(a => {

            a.classList.toggle(

              'is-current',

              a.getAttribute(
                'href'
              ) ===
              '#' +
              entry.target.id

            );

          });

        });

      },

      {
        rootMargin:
          '-40% 0px -55% 0px'
      }

    );


  sections.forEach(
    section =>
      observer.observe(section)
  );

}


/* =========================
   SCROLL PROGRESS
========================= */

const header =
  document.querySelector(
    '.site-header'
  );


const progress =
  document.createElement(
    'div'
  );


progress.className =
  'scroll-progress';


document.body.appendChild(
  progress
);


function updateScrollUI() {

  const scrollTop =
    window.scrollY;


  const max =
    document.documentElement
      .scrollHeight -
    window.innerHeight;


  progress.style.width =
    max > 0
      ? `${(scrollTop / max) * 100}%`
      : '0%';


  if (header) {

    header.classList.toggle(
      'is-scrolled',
      scrollTop > 8
    );

  }

}


window.addEventListener(
  'scroll',
  updateScrollUI,
  {
    passive: true
  }
);


updateScrollUI();


/* =========================
   REVEAL ANIMATION
========================= */

function observeReveals() {

  const items =
    document.querySelectorAll(
      '.section:not(.reveal), .event.reveal, .form, .gallery-item, .coordinators'
    );


  if (
    !('IntersectionObserver' in window)
  ) {

    items.forEach(
      el =>
        el.classList.add(
          'is-visible'
        )
    );

    return;

  }


  const revealObserver =
    new IntersectionObserver(

      entries => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) {

              return;

            }


            entry.target.classList.add(
              'reveal',
              'is-visible'
            );


            revealObserver.unobserve(
              entry.target
            );

          }
        );

      },

      {
        threshold: 0.08
      }

    );


  items.forEach(el => {

    if (
      !el.classList.contains(
        'is-visible'
      )
    ) {

      revealObserver.observe(el);

    }

  });

}


observeReveals();


/* =========================
   CLOSE MOBILE MENU
========================= */

document.addEventListener(
  'click',
  e => {

    if (
      !siteNav?.classList.contains(
        'is-open'
      )
    ) {

      return;

    }


    if (
      siteNav.contains(e.target) ||
      navToggle.contains(e.target)
    ) {

      return;

    }


    siteNav.classList.remove(
      'is-open'
    );


    navToggle.setAttribute(
      'aria-expanded',
      'false'
    );

  }
);


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
  'keydown',
  e => {

    if (
      e.key === 'Escape' &&
      siteNav?.classList.contains(
        'is-open'
      )
    ) {

      siteNav.classList.remove(
        'is-open'
      );


      navToggle.setAttribute(
        'aria-expanded',
        'false'
      );


      navToggle.focus();

    }

  }
);