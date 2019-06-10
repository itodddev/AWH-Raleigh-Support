export function getConfigSetting(firestoreRef, collectionItem, configItem, dataItem) {
  firestoreRef
    .collection(collectionItem)
    .doc(configItem)
    .get()
    .then(setting => {
      let letters = Object.keys(setting.data());
      let names = Object.values(setting.data());
      let items = [];
      for (let i = 0; i < letters.length; i++) {
        items[i] = { letter: letters[i], name: names[i] };
        dataItem.push(items[i]);
      }
    });
}