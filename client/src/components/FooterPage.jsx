import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsDiscord,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

const FooterPage = () => {
  return (
    <Footer container className="border border-t-4 border-purple-300">
      <div className="w-full max-w-7xl mx-auto">
        <div className="">
          <div className="">
            <Link to="/" className="text-sm font-bold dark:text-white">
              <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-400 to bg-pink-400 rounded-lg text-white">
                Learn With Me
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm: mt-4 sm:grid-cols-3 sm:gap-6">
            <div className="mt-8">
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.100jsprojects.com"
                  target="_blank"
                >
                  100 Projects Javscript
                </Footer.Link>
                <Footer.Link href="/about" target="_blank">
                  Learn With Me Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div className="mt-8">
              <Footer.Title title="Follow me" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.github.com/BuiHoangDieu"
                  target="_blank"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div className="mt-8">
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms & Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider />
        <div>
          <Footer.Copyright
            href="#"
            by="Bui Dieu"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-4 mt-4 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDiscord} />
            <Footer.Icon href="#" icon={BsTwitter} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterPage;
