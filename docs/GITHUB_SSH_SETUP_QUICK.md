# 🚀 Configuration GitHub SSH Rapide

## ✅ Ce qui est déjà fait

- ✅ Votre remote Git utilise déjà SSH (`git@github.com`)
- ✅ Fichier `~/.ssh/config` créé et configuré
- ✅ Vous avez une clé SSH `id_ed25519`

## 📋 Étapes à suivre

### 1. Copier votre clé publique SSH

```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

La clé est maintenant dans votre presse-papiers !

### 2. Ajouter la clé à GitHub

1. Aller sur : https://github.com/settings/keys
2. Cliquer sur **"New SSH key"** (bouton vert)
3. **Title** : Donner un nom (ex: "Mac - MacBook Pro")
4. **Key** : Coller la clé (`Cmd+V`)
5. Cliquer sur **"Add SSH key"**

### 3. Tester la connexion

```bash
ssh -T git@github.com
```

Vous devriez voir :
```
Hi [votre-username]! You've successfully authenticated, but GitHub does not provide shell access.
```

### 4. Utiliser la clé automatiquement

La première fois, macOS vous demandera votre passphrase SSH et vous proposera de la sauvegarder dans le Keychain. **Acceptez** pour ne plus avoir à la saisir.

Pour ajouter la clé maintenant :
```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

Entrez votre passphrase SSH une fois, puis macOS la sauvegardera.

## ✅ Résultat

Après ça, vous pourrez faire `git push` sans jamais entrer de mot de passe !

## 🔧 Si ça ne marche pas

Si vous avez toujours "Permission denied", vérifiez que :
1. La clé publique est bien ajoutée sur GitHub
2. Vous utilisez la bonne clé (vérifiez avec `cat ~/.ssh/id_ed25519.pub`)
3. La clé est ajoutée à l'agent : `ssh-add -l` (doit lister votre clé)

## 📝 Note importante

Votre clé SSH a une passphrase pour la sécurité. La première fois que vous l'utilisez après redémarrage, macOS vous demandera votre passphrase. Si vous acceptez de la sauvegarder dans le Keychain, vous n'aurez plus à la saisir.

