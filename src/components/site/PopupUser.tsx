import { ROLES } from "@/commons/constant";
import Link from "next/link";

export function UserPopup({ profile, handleLogout }: any) {
  return (
    <div className="absolute right-0  w-64 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
      <div className="p-6 pb-4 border-b border-slate-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-md">
            {profile.username?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800 leading-none">
              {profile.username}
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
              {profile.role === ROLES.ADMIN
                ? "Quản trị viên"
                : profile.role === ROLES.AFFILIATE
                  ? "Đại lí"
                  : "Unknow"}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium truncate">{profile.email}</p>
      </div>

      {/* Menu Items */}

      <div className="p-2">
        {profile.role === ROLES.ADMIN ? (
          <Link href="/admin">
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all group cursor-pointer">
              <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-bold">Admin Dashboard</span>
            </button>
          </Link>
        ) : profile.role === ROLES.AFFILIATE ? (
          <Link href="/affiliate">
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all group cursor-pointer">
              <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-bold">Affiliate Dashboard</span>
            </button>
          </Link>
        ) : null}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all group cursor-pointer"
        >
          <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <span className="text-sm font-bold">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
