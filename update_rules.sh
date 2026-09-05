cat firestore.rules | awk '
  /settings\/{document=\*\*}/ {
    print "    // Categories collection rules"
    print "    match /categories/{categoryId} {"
    print "      allow read: if isAuthenticated();"
    print "      allow write: if isAuthenticated() && (getUserRole() == \"ADMIN\" || getUserRole() == \"SEKRETARIS\");"
    print "    }"
    print ""
    print "    // Archives collection rules"
    print "    match /archives/{archiveId} {"
    print "      allow read: if isAuthenticated();"
    print "      allow write: if isAuthenticated() && (getUserRole() == \"ADMIN\" || getUserRole() == \"BENDAHARA\");"
    print "    }"
    print ""
  }
  {print}
' > firestore.rules.tmp && mv firestore.rules.tmp firestore.rules
