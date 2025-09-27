import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, Links, ScrollRestoration, Scripts, Link, useNavigate, Form, NavLink, useSearchParams, UNSAFE_withHydrateFallbackProps } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import axios from "axios";
import { useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("link", {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      }), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png"
      }), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png"
      }), /* @__PURE__ */ jsx("link", {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
      }), /* @__PURE__ */ jsx("link", {
        rel: "manifest",
        href: "/site.webmanifest"
      }), /* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function Root() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(Outlet, {})
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const serverURL = "http://127.0.0.1:8000/";
axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
  baseURL: serverURL,
  timeout: 1e4
});
axios.interceptors.response.use((r) => {
  console.log("interseptor");
  const authExceptionsStatuses = [401, 403];
  if (authExceptionsStatuses.includes(r.status)) {
    console.log(r);
    localStorage.removeItem("username");
  }
  console.log("response", r);
  return r;
});
const serverURL$1 = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(Outlet, {})
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  axiosInstance,
  default: serverURL$1,
  serverURL
}, Symbol.toStringTag, { value: "Module" }));
const Main = UNSAFE_withComponentProps(function Main2() {
  return /* @__PURE__ */ jsx("div", {
    className: "w-full",
    children: /* @__PURE__ */ jsx(Outlet, {})
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Main
}, Symbol.toStringTag, { value: "Module" }));
const LOGOUT_URL$1 = "auth/logout";
function Authorized({ username, auth, setAuth }) {
  const handleLogout = async () => {
    if (auth) {
      const response = await axiosInstance.get(LOGOUT_URL$1).then(() => {
        setAuth(false);
        localStorage.removeItem("username");
      });
      console.log(response);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-gray-2 text-base relative top-[110px]", children: [
    /* @__PURE__ */ jsxs("div", { className: " flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center", children: "You are signed in as" }),
      /* @__PURE__ */ jsx("div", { className: "text-xl font-semibold", children: username })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col relative top-[50px] gap-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/catalog",
          className: "button-login text-center",
          children: "Open catalog"
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "font-light underline text-center cursor-pointer",
          onClick: handleLogout,
          children: "logout"
        }
      )
    ] })
  ] });
}
class Validator {
  validateEmail(email) {
    const atCheck = /^[^@]+@[^@]+$/;
    const edgeDotCheck = /^[^\.](.*[^\.])?$/;
    const doubleDotCheck = /^(\.(?!\.)|[^\.])*$/;
    const domainDotCheck = /.+\..+/;
    function emailCheckAt(email2) {
      const regex = atCheck;
      return regex.test(email2);
    }
    function emailEdgeDotsCheck(emailPart) {
      const regex = edgeDotCheck;
      return regex.test(emailPart);
    }
    function emailDoubleDotCheck(emailPart) {
      const regex = doubleDotCheck;
      return regex.test(emailPart);
    }
    function emailDomainDotCheck(domain) {
      const regex = domainDotCheck;
      return regex.test(domain);
    }
    if (emailCheckAt(email)) {
      const [local, domain] = email.split("@");
      const is_valid = emailDoubleDotCheck(local) && emailDoubleDotCheck(domain) && emailEdgeDotsCheck(local) && emailEdgeDotsCheck(domain) && emailDomainDotCheck(domain);
      console.log("Email " + email + " | --> valid: " + String(is_valid));
      return is_valid;
    } else {
      console.log("Email " + email + " | --> valid:  false");
      return false;
    }
  }
  validatePassword(password) {
    const allowedLength = 4;
    function passwordLengthCheck() {
      return password.length >= allowedLength;
    }
    function passwordNumOnlyCheck() {
      const passwordArray = password.split("");
      const allNum = passwordArray.every((s) => /\d/.test(s));
      return !allNum;
    }
    const isValid = passwordLengthCheck() && passwordNumOnlyCheck();
    return isValid;
  }
}
const validator = new Validator();
const GOOGLE_CLIENT_ID = "490929836960-plnk8koetjuhdlvqgippagb89k9kfjts.apps.googleusercontent.com";
const SERVER_URL = "http://127.0.0.1:8000";
function startGoogleAuthFlow() {
  const redirectUri = SERVER_URL + "/auth/google/callback";
  console.log(redirectUri);
  const scope = "openid email profile https://www.googleapis.com/auth/drive.readonly";
  const responseType = "code";
  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  window.location.href = oauthUrl;
}
const loginURL = serverURL + "/auth/login";
function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting");
    const emailValid = validator.validateEmail(email);
    const passwordValid = validator.validatePassword(password);
    console.log("valid data; password", passwordValid, "email:", emailValid);
    if (emailValid && passwordValid) {
      console.log("sending request");
      axios.post(loginURL, { email, password }).then((r) => {
        console.log("login:", r.status);
        if (r.status === 200) {
          localStorage.setItem("username", email);
          nav("/catalog");
        } else {
          setErrors({
            email: "Incorrect user data.",
            password: "Incorrect user data."
          });
        }
      }).catch((r) => {
        console.log("login: caught", r);
        setErrors({
          email: "Incorrect user data.",
          password: "Incorrect user data."
        });
      });
    } else {
      if (!emailValid) {
        setErrors({ ...errors, email: "Please enter correct email." });
      }
      if (!passwordValid) {
        setErrors({ ...errors, password: "Please enter correct password." });
      }
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      Form,
      {
        className: "flex flex-col items-center gap-2.5 mt-2.5",
        onSubmit: handleSubmit,
        navigate: false,
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "input-login",
                type: "text",
                placeholder: "email",
                name: "email",
                onChange: handleChange,
                value: email
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "h-3.5 mt-1 text-sm text-red-error font-sans", children: errors.email || "" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "input-login",
                type: "password",
                placeholder: "password",
                name: "password",
                onChange: handleChange,
                value: password
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "h-3.5 mt-1 text-sm text-red-error font-sans", children: errors.password || "" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "button-login mt-3",
              children: "Sign In"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-3 text-center", children: "or log in via:" }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-7 justify-center mt-3", children: [
      /* @__PURE__ */ jsx("div", { onClick: startGoogleAuthFlow, children: "Google" }),
      /* @__PURE__ */ jsx("div", { children: "Yandex" }),
      /* @__PURE__ */ jsx("div", { children: "Microsoft" })
    ] })
  ] });
}
function Auth({ params }) {
  return /* @__PURE__ */ jsx("div", { className: "ml-[30px] mt-[38px] bg-[url(/public/assets/login_lines.svg)] w-[436px] h-[436px]", children: params.auth ? /* @__PURE__ */ jsx(
    Authorized,
    {
      username: params.username,
      auth: params.auth,
      setAuth: params.setAuth
    }
  ) : /* @__PURE__ */ jsxs("div", { className: "w-[334px] h-[360px] relative left-[50px] top-[50px] flex flex-col items-center gap-3 pt-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-9", children: [
      /* @__PURE__ */ jsx(
        NavLink,
        {
          className: "text-xl text-gray-2 font-semibold hover:cursor-pointer ",
          id: "signin",
          to: "/",
          children: "Sign In"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "bg-gray-line w-[1px] h-full" }),
      /* @__PURE__ */ jsx(
        NavLink,
        {
          className: "text-xl text-gray-2 font-semibold hover:cursor-pointer active:text-green-dark",
          to: "/signup",
          id: "signup",
          children: "Sign Up"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Login, {})
  ] }) });
}
const LOGOUT_URL = "auth/logout";
function Header({ params }) {
  const handleAuth = async () => {
    if (params.auth) {
      const response = await axiosInstance.get(LOGOUT_URL).then(() => {
        params.setAuth(false);
        localStorage.removeItem("username");
      });
      console.log(response);
    }
  };
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: "flex flex-col items-center h-[32px] w-full",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex w-[1300px] grow ", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gray-line w-[1px] h-full" }),
          /* @__PURE__ */ jsx("div", { className: "w-[862px] h-full " }),
          /* @__PURE__ */ jsx("div", { className: "flex grow justify-end pr-4", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleAuth,
              className: "cursor-pointer text-gray-2",
              children: params.auth ? "Logout" : "Login"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "gr-gray-line h-[1px] w-full" })
      ]
    }
  );
}
const PROFILE_URL = "auth/profile";
function shouldRevalidate$1() {
}
async function clientLoader$2() {
  const userInfo = axiosInstance.get(PROFILE_URL, {
    withCredentials: true
  }).then((r) => {
    console.log(r);
    return r;
  }).catch((r) => {
    console.log("user is not authorized", r);
  });
  return userInfo;
}
const Index = UNSAFE_withComponentProps(function Index2({
  loaderData
}) {
  const username = loaderData ? loaderData.data.email : null;
  const [auth, setAuth] = useState(username ? true : false);
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx(Header, {
      params: {
        username,
        auth,
        setAuth
      }
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex justify-center text-left w-full",
      children: [/* @__PURE__ */ jsx("div", {
        className: "gr-gray-line-v w-[1px] h-dvh mt-[117px]"
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-[862px_auto] gap-4 w-[1284px] ",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "",
          children: [/* @__PURE__ */ jsx("div", {
            className: "",
            children: /* @__PURE__ */ jsx("h1", {
              className: "font-semibold mt-7 px-9",
              children: "Organize your cloud files in a virtual catalog"
            })
          }), /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsxs("div", {
              className: "grid grid-rows-subgrid gap-5 text-lg italic font-serif mt-8 px-9",
              children: [/* @__PURE__ */ jsx("p", {
                children: "Create your own remote file tree to sort files from one or multiple cloud storage provider."
              }), /* @__PURE__ */ jsx("p", {
                children: "Add descriptions, tags, categories and dates to files in your catalog to make navigation easier."
              }), /* @__PURE__ */ jsx("p", {
                children: "Export or download your catalog."
              })]
            })
          }), /* @__PURE__ */ jsx("div", {
            "aria-hidden": "true",
            className: "mt-12",
            children: /* @__PURE__ */ jsx("div", {
              className: "h-[1px] gr-gray-line w-[calc(105%+2.25rem)] relative left-[calc(-5%-2.25rem)]"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "grid grid-rows-subgrid mt-8 px-9",
            children: [/* @__PURE__ */ jsx("h3", {
              children: "What this app is for"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-5 font-sans",
              children: "This application is designed to help you with managing files that are stored with cloud storage services (etc. google drive or yandex disk)."
            })]
          }), /* @__PURE__ */ jsx("div", {
            "aria-hidden": "true",
            className: "mt-12"
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-8 px-9",
            children: [/* @__PURE__ */ jsx("h3", {
              children: "How it works"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-5 font-sans",
              children: "The App allows you to create your personal catalog with entries which are connected to your remote file, files or directory (via link provided by the service). The catalog is saved on the App’s server side. It does not store any of your files from cloud services, only the data created in the App and the link to the remote file are stored. In order to navigate through your cloud storage the App will request you to connect to the service (with oAuth protocol) and ask for read-only permissions."
            })]
          }), /* @__PURE__ */ jsx("div", {
            "aria-hidden": "true",
            className: "mt-12"
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-8 px-9",
            children: [/* @__PURE__ */ jsx("h3", {
              children: "Preview"
            }), /* @__PURE__ */ jsx("p", {})]
          }), /* @__PURE__ */ jsx("div", {
            "aria-hidden": "true",
            className: "mt-12"
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-8 px-9",
            children: [/* @__PURE__ */ jsx("h3", {
              children: "Github"
            }), /* @__PURE__ */ jsx("p", {})]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "col-auto",
          children: /* @__PURE__ */ jsx(Auth, {
            params: {
              auth,
              username,
              setAuth
            }
          })
        })]
      })]
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader: clientLoader$2,
  default: Index,
  shouldRevalidate: shouldRevalidate$1
}, Symbol.toStringTag, { value: "Module" }));
const Signup = UNSAFE_withComponentProps(function Signup2() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: "SignUp"
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Signup
}, Symbol.toStringTag, { value: "Module" }));
function FileTree({ treeData }) {
  if (!treeData) {
    return /* @__PURE__ */ jsx("div", { children: "No data" });
  }
  const tree = treeData.data.tree.root;
  const [searchParams, setSearchParams] = useSearchParams();
  const handleEntryClick = (e, entryId) => {
    setSearchParams(`?entry=${entryId}`);
  };
  function formatRow(row, indent, path = "") {
    let rowFormatted = [];
    row.forEach((file, index) => {
      const indentCalc = file.type === "folder" ? indent : indent + 6;
      const folderChildren = file.type === "folder" ? formatRow(file.children, 10, path + "/" + file.name) : "";
      const arrow_ = file.type === "folder" ? (
        // <img
        // 	src={arrow}
        // 	alt="arrow-folder"
        // 	className="arrow mr-3 transition-transform duration-300"
        // />
        /* @__PURE__ */ jsx("div", { className: "arrow mr-3 transition-transform duration-300", children: "> " })
      ) : /* @__PURE__ */ jsx("div", { className: "text-gray-2 mr-2.5", children: "- " });
      rowFormatted.push(
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "cursor-pointer",
            style: { paddingLeft: `${indentCalc}px` },
            id: `file-${path}/${file.name}`,
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: `input-${path}/${file.name}`,
                  className: "peer hidden"
                }
              ),
              file.type === "folder" ? /* @__PURE__ */ jsxs(
                "label",
                {
                  className: "flex select-none cursor-pointer peer-checked:[&_.arrow]:rotate-90 text-gray-700 font-semibold",
                  htmlFor: `input-${path}/${file.name}`,
                  children: [
                    arrow_,
                    file.name
                  ]
                }
              ) : /* @__PURE__ */ jsxs(
                "label",
                {
                  className: "flex select-none cursor-pointer peer-checked:[&_.arrow]:rotate-90 text-gray-700 font-normal",
                  htmlFor: `input-${path}/${file.name}`,
                  onClick: (e) => handleEntryClick(e, file.pk),
                  children: [
                    arrow_,
                    file.name
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  id: `content-${path}/${file.name}`,
                  className: "hidden peer-checked:block",
                  children: folderChildren
                }
              )
            ]
          },
          `file-${path}/${file.name}`
        )
      );
    });
    return rowFormatted;
  }
  const treeF = formatRow(tree, 0);
  return /* @__PURE__ */ jsx("div", { children: treeF });
}
const createEntryIcon = "data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4%200H13V13H0V4L4%200Z'%20fill='white'/%3e%3cpath%20d='M4%200V4H0L4%200Z'%20fill='%23ADADAD'/%3e%3cline%20x1='12.5'%20y1='9'%20x2='12.5'%20y2='16'%20stroke='%23414141'/%3e%3cline%20x1='9'%20y1='12.5'%20x2='16'%20y2='12.5'%20stroke='%23414141'/%3e%3c/svg%3e";
const createFolderIcon = "data:image/svg+xml,%3csvg%20width='17'%20height='16'%20viewBox='0%200%2017%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M11%200V4H0V0H11Z'%20fill='white'/%3e%3cpath%20d='M4.89474%202C5.44702%202%205.89474%201.55228%205.89474%201V1C5.89474%200.447715%206.34245%200%206.89474%200H12C13.1046%200%2014%200.895431%2014%202V11C14%2012.1046%2013.1046%2013%2012%2013H2C0.89543%2013%200%2012.1046%200%2011V4C0%202.89543%200.895431%202%202%202H4.89474Z'%20fill='%23ADADAD'/%3e%3cline%20x1='13.5'%20y1='9'%20x2='13.5'%20y2='16'%20stroke='%23414141'/%3e%3cline%20x1='10'%20y1='12.5'%20x2='17'%20y2='12.5'%20stroke='%23414141'/%3e%3c/svg%3e";
function LeftPannel({ treeData }) {
  const [blockVisible, setBlockVisible] = useState({
    menu: true,
    files: true,
    tags: true,
    categories: true
  });
  const handleClick = (e) => {
    const id = e.currentTarget.id;
    setBlockVisible({ ...blockVisible, [id]: !blockVisible[id] });
  };
  const visibleStyle = " min-h-[26px] max-h-fit";
  const hiddenStyle = " max-h-0 overflow-hidden";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-1/9 h-screen bg-gray-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          id: "menu",
          className: "font-sans text-base bg-gray-3 h-[26px] pl-2 cursor-pointer",
          onClick: handleClick,
          children: "My Catalog"
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `lex flex-col text-sm font-mono pl-2 transition duration-300 ease-out bg-gray-4 ${blockVisible.menu ? visibleStyle : hiddenStyle}`,
          children: "content"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          id: "files",
          className: "flex items-center font-sans text-base bg-gray-3 h-[26px] px-2 cursor-pointer",
          onClick: handleClick,
          children: [
            /* @__PURE__ */ jsx("div", { className: "grow", children: "Files" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: createEntryIcon,
                  alt: "create-entry-icon"
                }
              ) }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: createFolderIcon,
                  alt: "create-folder-icon"
                }
              ) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex flex-col text-sm font-mono pl-2 transition duration-300 ease-out bg-gray-4 ${blockVisible.files ? visibleStyle : hiddenStyle}`,
          children: /* @__PURE__ */ jsx(FileTree, { treeData })
        }
      )
    ] })
  ] });
}
function ServiceNav() {
  return /* @__PURE__ */ jsx("div", { className: "" });
}
function Fallback({ message, link = "", linkText = "" }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center items-center mt-10", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xl font-semibold text-gray-2", children: message }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: link,
        className: "font-light underline",
        children: linkText
      }
    )
  ] });
}
function useFetchV3(url) {
  const [loading, setLoading] = useState("idle");
  const [data, setData] = useState(void 0);
  console.log("loading", loading);
  useEffect(() => {
    console.log("sending request");
    axiosInstance.get(url, { timeout: 3e4 }).then((r) => {
      console.log("service response:", r);
      setData({ data: r.data, status: r.status, message: "success" });
      setLoading("idle");
    }).catch((r) => {
      setData({ data: r.data, status: r.status, message: r.message });
      setLoading("idle");
    });
  }, [url]);
  return { data, loading };
}
const ENTRY_URL = "api-v1/catalog/entry";
function CatalogEntry() {
  const [params, setParams] = useSearchParams();
  const entryId = params.get("entry");
  if (!entryId) {
    return /* @__PURE__ */ jsxs("div", { className: "grow", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gray-4 h-[26px] ", children: /* @__PURE__ */ jsx("div", { className: "font-sans text-sm ml-3" }) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("h5", { className: "text-gray-400 font-mono", children: "Choose a folder or an entry to display" }) })
    ] });
  }
  const fetchData = useFetchV3(ENTRY_URL + "/" + entryId);
  const loading = fetchData.loading;
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { children: loading }) });
}
const TREE_URL = "api-v1/catalog/tree";
function shouldRevalidate({
  currentUrl,
  nextUrl
}) {
  return !(currentUrl.pathname.startsWith("/catalog") && nextUrl.pathname.startsWith("/catalog"));
}
async function clientLoader$1({
  params
}) {
  const treeData = await axiosInstance.get(TREE_URL).then((r) => {
    return {
      data: r.data,
      status: r.status,
      message: "success"
    };
  }).catch((r) => {
    return {
      data: r.data,
      status: r.status,
      message: r.message
    };
  });
  return {
    treeData
  };
}
const HydrateFallback = UNSAFE_withHydrateFallbackProps(function HydrateFallback2() {
  return /* @__PURE__ */ jsxs("div", {
    className: "w-full min-h-screen flex",
    children: [/* @__PURE__ */ jsx(LeftPannel, {
      treeData: void 0
    }), /* @__PURE__ */ jsxs("div", {
      className: "grow max-w-4/9",
      children: [/* @__PURE__ */ jsx("div", {
        className: "bg-gray-3 h-[26px]"
      }), /* @__PURE__ */ jsx(Fallback, {
        message: "loading..."
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "grow max-w-4/9",
      children: [/* @__PURE__ */ jsx("div", {
        className: "bg-gray-3 h-[26px]"
      }), /* @__PURE__ */ jsx(Fallback, {
        message: "loading..."
      })]
    })]
  });
});
const Catalog = UNSAFE_withComponentProps(function Catalog2({
  loaderData
}) {
  return loaderData.treeData.status === 200 ? /* @__PURE__ */ jsxs("div", {
    className: "w-full min-h-screen flex",
    children: [/* @__PURE__ */ jsx(LeftPannel, {
      treeData: loaderData.treeData
    }), /* @__PURE__ */ jsx(CatalogEntry, {}), /* @__PURE__ */ jsxs("div", {
      className: "grow max-w-4/9",
      children: [/* @__PURE__ */ jsx("div", {
        className: "bg-gray-3 h-[26px]"
      }), /* @__PURE__ */ jsx(ServiceNav, {})]
    })]
  }) : /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col justify-center items-center mt-10",
    children: [/* @__PURE__ */ jsx("div", {
      className: "text-xl font-semibold text-gray-2",
      children: "Please, sign up to access the catalog"
    }), /* @__PURE__ */ jsx(Link, {
      to: "/",
      className: "font-light underline",
      children: "Back to the main page"
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HydrateFallback,
  clientLoader: clientLoader$1,
  default: Catalog,
  shouldRevalidate
}, Symbol.toStringTag, { value: "Module" }));
const PassReset = UNSAFE_withComponentProps(function PassReset2() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("h3", {
      children: "To reset your password please enter your email address that you previously used to sign in."
    }), /* @__PURE__ */ jsx("div", {
      children: /* @__PURE__ */ jsx("form", {
        children: /* @__PURE__ */ jsx("input", {
          type: "text",
          placeholder: "email"
        })
      })
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PassReset
}, Symbol.toStringTag, { value: "Module" }));
const TOKEN_CONVERT_URL = "auth/temp-token-convert";
async function clientLoader({
  request
}) {
  const url = new URL(request.url);
  const temp_token = url.searchParams.get("token");
  const response = await axiosInstance.post(TOKEN_CONVERT_URL, {
    token: temp_token
  }, {
    withCredentials: true
  }).then((r) => {
    console.log(r);
    if (r.status === 200) {
      return r;
    }
  }).catch((r) => {
    console.log(r);
    return r;
  });
  return response;
}
const OauthSuccess = UNSAFE_withComponentProps(function OauthSuccess2({
  loaderData
}) {
  console.log(loaderData);
  return /* @__PURE__ */ jsx("div", {
    className: "flex justify-center text-center text-gray-2",
    children: loaderData.status !== 200 ? /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("div", {
        children: "Authorization error"
      }), /* @__PURE__ */ jsx("div", {
        children: "Something went wrong"
      }), /* @__PURE__ */ jsx(Link, {
        to: "/",
        className: "underline",
        children: "back to main page"
      })]
    }) : /* @__PURE__ */ jsxs("div", {
      className: "",
      children: [/* @__PURE__ */ jsx("div", {
        children: "You have successfully signed in"
      }), /* @__PURE__ */ jsx(Link, {
        to: "/catalog",
        className: "button-login text-center",
        children: "Open catalog"
      })]
    })
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader,
  default: OauthSuccess
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DWlxrz2E.js", "imports": ["/assets/chunk-B7RQU5TL-BHJdDF5G.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-AU-_aPMl.js", "imports": ["/assets/chunk-B7RQU5TL-BHJdDF5G.js"], "css": ["/assets/root-D1weL3Jn.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "main": { "id": "main", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/main-C8DL6AVH.js", "imports": ["/assets/main-CZOfJWF6.js", "/assets/chunk-B7RQU5TL-BHJdDF5G.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Main": { "id": "routes/Main", "parentId": "main", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Main-D2irBZNj.js", "imports": ["/assets/chunk-B7RQU5TL-BHJdDF5G.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Index": { "id": "routes/Index", "parentId": "routes/Main", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Index-LsLT6RXF.js", "imports": ["/assets/chunk-B7RQU5TL-BHJdDF5G.js", "/assets/main-CZOfJWF6.js"], "css": ["/assets/Index-bFu_TAjp.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Signup": { "id": "routes/Signup", "parentId": "routes/Main", "path": "signup", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Signup-kqdH-1vM.js", "imports": ["/assets/chunk-B7RQU5TL-BHJdDF5G.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Catalog": { "id": "routes/Catalog", "parentId": "routes/Main", "path": "catalog", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Catalog-BVi7vNaN.js", "imports": ["/assets/chunk-B7RQU5TL-BHJdDF5G.js", "/assets/main-CZOfJWF6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/PassReset": { "id": "routes/PassReset", "parentId": "routes/Main", "path": "password-reset", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/PassReset-CZrRLKy3.js", "imports": ["/assets/chunk-B7RQU5TL-BHJdDF5G.js", "/assets/main-CZOfJWF6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/OauthSuccess": { "id": "routes/OauthSuccess", "parentId": "routes/Main", "path": "oauth-success", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/OauthSuccess-vvx1uXwK.js", "imports": ["/assets/chunk-B7RQU5TL-BHJdDF5G.js", "/assets/main-CZOfJWF6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-8ea1ab39.js", "version": "8ea1ab39", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "main": {
    id: "main",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/Main": {
    id: "routes/Main",
    parentId: "main",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/Index": {
    id: "routes/Index",
    parentId: "routes/Main",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/Signup": {
    id: "routes/Signup",
    parentId: "routes/Main",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/Catalog": {
    id: "routes/Catalog",
    parentId: "routes/Main",
    path: "catalog",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/PassReset": {
    id: "routes/PassReset",
    parentId: "routes/Main",
    path: "password-reset",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/OauthSuccess": {
    id: "routes/OauthSuccess",
    parentId: "routes/Main",
    path: "oauth-success",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
