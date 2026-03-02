// localStorage-based fake database

const KEY = {
  users: "tbx_users",
  jobs: "tbx_jobs",
  applications: "tbx_applications",
  session: "tbx_session",
};

function get(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function set(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function seed() {
  if (localStorage.getItem("tbx_seeded")) return;

  const users = [
    {
      id: "admin1",
      name: "Admin User",
      email: "admin@talentboardx.com",
      password: "admin123",
      role: "admin",
      createdAt: "2026-01-01",
    },
  ];

  set(KEY.users, users);
  set(KEY.jobs, []);
  set(KEY.applications, []);
  localStorage.setItem("tbx_seeded", "1");
}

seed();

export const db = {
  signup(name, email, password, role) {
    const users = get(KEY.users);
    if (users.find((u) => u.email === email))
      return "Email already exists";

    const user = {
      id: uid(),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    users.push(user);
    set(KEY.users, users);
    localStorage.setItem(KEY.session, JSON.stringify(user));
    return user;
  },

  login(email, password) {
    const users = get(KEY.users);
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) return "Invalid credentials";

    localStorage.setItem(KEY.session, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(KEY.session);
  },

  currentUser() {
    try {
      return JSON.parse(localStorage.getItem(KEY.session));
    } catch {
      return null;
    }
  },

  getJobs() {
    return get(KEY.jobs);
  },

  getJobsByEmployer(id) {
    return get(KEY.jobs).filter((j) => j.employerId === id);
  },

  postJob(job) {
    const jobs = get(KEY.jobs);
    const newJob = {
      ...job,
      id: uid(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    jobs.push(newJob);
    set(KEY.jobs, jobs);
    return newJob;
  },

  apply(jobId, seekerId) {
    const apps = get(KEY.applications);

    if (apps.find((a) => a.jobId === jobId && a.seekerId === seekerId))
      return "Already applied";

    const app = {
      id: uid(),
      jobId,
      seekerId,
      status: "Applied",
      aiScore: Math.floor(Math.random() * 30) + 70,
      appliedAt: new Date().toISOString().slice(0, 10),
    };

    apps.push(app);
    set(KEY.applications, apps);
    return app;
  },

  getApplicationsByEmployer(employerId) {
    const jobs = get(KEY.jobs).filter(
      (j) => j.employerId === employerId
    );
    const jobIds = jobs.map((j) => j.id);

    return get(KEY.applications).filter((a) =>
      jobIds.includes(a.jobId)
    );
  },

  updateApplicationStatus(appId, status) {
    const apps = get(KEY.applications);
    const index = apps.findIndex((a) => a.id === appId);
    if (index !== -1) {
      apps[index].status = status;
      set(KEY.applications, apps);
    }
  },
};