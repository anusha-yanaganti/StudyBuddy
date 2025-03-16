const Avatar= ({ selectedAvatar, setSelectedAvatar }) => {
    const avatars = [
      "https://png.pngtree.com/png-clipart/20241127/original/pngtree-creative-boys-avatar-png-image_17327785.png",
      "https://static.vecteezy.com/system/resources/previews/027/951/137/non_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
      "https://png.pngtree.com/png-vector/20240910/ourmid/pngtree-business-women-avatar-png-image_13805764.png",
      "https://static.vecteezy.com/system/resources/thumbnails/004/899/680/small/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg",
    ];
  
    return (
      <div className="avatar-selector">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            className={`avatar-option ${selectedAvatar === avatar ? "selected" : ""}`}
            onClick={() => setSelectedAvatar(avatar)}
          />
        ))}
      </div>
    );
  };
  
  export default Avatar;
  