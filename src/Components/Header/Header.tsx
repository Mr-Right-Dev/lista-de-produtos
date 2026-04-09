import './header.css';
import logo from './../../Assets/logo.png';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const Header = () => {
    const languages = [
        { code: 'en', label: 'English' },
        { code: 'pt', label: 'Português' },
    ];

    const { i18n } = useTranslation();
    const { t } = useTranslation();

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        document.querySelector("body")?.setAttribute("data-bs-theme", theme);
        document.title = t("appName");
    });

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.name)

        document.querySelector("body")?.setAttribute("data-bs-theme", theme);
        localStorage.setItem("theme", e.target.name);
    };

    

    return (
        <div id="main-header" className="d-flex w-100 justify-content-start align-items-center">
            <div className="d-inline-flex align-items-center" onClick={() => {
            }}>
                <img className="logo m-1" src={logo} />
                <p id="location" className="m-1 text-truncate sacrifice">Mr-Right-Dev @ Github</p>
            </div>
            <i className="divider h-75 m-3"></i>
            <div className="d-inline-flex align-items-center">
                <p id="themetxt" className="m-1 d-inline-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sun-fill" viewBox="0 0 16 16">
                        <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
                    </svg>
                    {t("themeLabel")}
                </p>

                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" className="btn-check" checked={theme == "dark"} name="dark" radioGroup="btnradio" id="btnradio1" onChange={handleThemeChange} />
                    <label className="btn btn-outline-primary" htmlFor="btnradio1">{t("themeDarkLabel")}</label>

                    <input type="radio" className="btn-check" checked={theme == "light"} name="light" radioGroup="btnradio" id="btnradio2" onChange={handleThemeChange} />
                    <label className="btn btn-outline-primary" htmlFor="btnradio2">{t("themeLightLabel")}</label>
                </div>
            </div>

            <select className="form-select" value={i18n.language} onChange={(e) => {
                i18n.changeLanguage(e.target.value);
                localStorage.setItem('lang', e.target.value);
            }} style={{ "width": "max(10%, 150px)", "position": "absolute", "right": "5px", "top": "50%", "transform": "translate(0, -50%)" }} aria-label="Select language">
                {
                    languages.map((row) => (
                        <option key={row.code} value={row.code}>{row.label + " (" + row.code.toUpperCase() + ")"}</option>
                    ))
                }
            </select>
        </div>
    );
}

export default Header