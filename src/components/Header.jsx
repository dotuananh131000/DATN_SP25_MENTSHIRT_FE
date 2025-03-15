function Header() {
  return (
    <div className="header h-[54px]">
      <div></div>
      <div className="flex items-center space-x-4">
        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <img src="" alt="User Avatar" className="w-8 h-8 rounded-full" />
          <span className="text-gray-600 font-medium">UserProfile</span>
        </div>

        {/* Logout */}
        <button className="text-red-500 font-medium hover:underline">
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
export default Header;
