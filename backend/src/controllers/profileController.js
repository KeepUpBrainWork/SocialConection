const fakeProfiles = [
  { id: 1, name: "Марія", age: 22, bio: "Люблю подорожі та фотографію 📸" },
  {
    id: 2,
    name: "Олександр",
    age: 26,
    bio: "Шукаю компанію для занять спортом 🏋️‍♂️",
  },
  { id: 3, name: "Анна", age: 24, bio: "Обожнюю серіали та смачну каву ☕" },
];

const getAllProfiles = (req, res) => {
  try {
    res.status(200).json(fakeProfiles);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера при отриманні профілів" });
  }
};

const getProfileById = (req, res) => {
  try {
    const profileId = Number(req.params.id);
    const profile = fakeProfiles.find((p) => p.id === profileId);
    if (!profile) {
      return res.status(404).json({ message: "Профіль не знайдено 😢" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера при отриманні профілю" });
  }
};

const createProfile = (req, res) => {
  try {
    const { name, age, bio } = req.body;
    if (!name || !age) {
      return res.status(400).json({ message: "Ім'я та вік обов'язкові поля" });
    }

    const newId =
      fakeProfiles.length > 0
        ? fakeProfiles[fakeProfiles.length - 1].id + 1
        : 1;

    const newProfile = {
      id: newId,
      name,
      age: Number(age),
      bio: bio || "",
    };

    fakeProfiles.push(newProfile);

    res.status(201).json(newProfile)({
      massage: "Профіль успішно створено 🎉",
      profile: newProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера при створенні профілю" });
  }
};

module.exports = {
  getAllProfiles,
  getProfileById,
  createProfile,
};
