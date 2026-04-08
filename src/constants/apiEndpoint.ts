const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  USER: {
    USER_ME: "/user",
  },
  FILE: {
    IMAGE: "/api/v1/files",
    PDF: "/api/v1/files/pdf",
  },
  COLLAGE: {
    GETALL: "/college",
    CREATE: "college",
    DELETE: "college/:id",
    EDIT: "college/:id",
  },
  DEPARTMENT: {
    CREATE: "department",
    GET: "department/list",
    DELETE: "department/:id",
    EDIT: "department/:id",
  },
  LAVOZIM: {
    GETALL: "/lavozim",
    CREATE: "/lavozim",
    UPDATE: "/lavozim/:id",
    DELETE: "/lavozim/:id",
    STATISTICS: "/lavozim/get-lavozim-statistiks",
  },
  TEACHER: {
    GETALL: "/teacher/search",
    GET_BY_ID: "teacher/:id",
    CREATE: "/teacher/saveUser",
    UPDATE_PROFILE: "/teacher/update-profile",
    EDIT_SELF: "/teacher/edit",
    DELETE: "/teacher/:id",
  },
  RESEARCH: {
    GET_ALL: "/research",
    GET_BY_ID: "/research/:id",
    GET_BY_USER: "/research/byUser/:id",
    CREATE: "/research",
    UPDATE: "/research/:id",
    DELETE: "/research/:id",
  },
  NAZORAT: {
    GET_ALL: "/nazorat",
    GET_BY_ID: "/nazorat/:id",
    GET_BY_USER: "/nazorat/byUser/:id",
    CREATE: "/nazorat",
    UPDATE: "/nazorat/:id",
    DELETE: "/nazorat/:id",
  },
  PUBLICATION: {
  GET_ALL: "/api/publication/get-page",
  GET_BY_ID: "/api/publication/:publicationId",
  GET_BY_USER: "/api/publication/byUser/:id",
  CREATE: "/api/publication",
  UPDATE: "/api/publication/:id",
  DELETE: "/api/publication/:id",
},
CONSULTATION: {
  GET_ALL: "/api/consultation/get-page",
  GET_BY_ID: "/api/consultation/:id",
  GET_BY_USER: "/api/consultation/byUser/:id",
  CREATE: "/api/consultation",
  UPDATE: "/api/consultation/:id",
  DELETE: "/api/consultation/:id",
},
AWARD: {
  GET_ALL: "/award",
  GET_BY_ID: "/award/:id",
  GET_BY_USER: "/award/byUser/:id",
  CREATE: "/award",
  UPDATE: "/award/:id",
  DELETE: "/award/:id",
},
};

export const { LOGIN, USER, FILE, COLLAGE, DEPARTMENT, LAVOZIM, TEACHER, RESEARCH, NAZORAT, PUBLICATION, CONSULTATION, AWARD } = API_ENDPOINTS;