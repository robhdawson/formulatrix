var sample = function(array) {
  return array[Math.floor(Math.random() * array.length)]
}

var Formulatrix = module.exports = function(options) {
  options = options || {}
  this.neededSlots = []
  this.templates = []
  this.wordsBySlot = {}
}

Formulatrix.prototype.addTemplates = function(templates) {
  var temp,
      match,
      slot

  templates.forEach(function(t) {
    temp = t.split(/(\s+)/)
    this.templates.push(temp)

    temp.forEach(function(w) {

      if (match = w.match(/^\$(.+)/)) {
        slot = match[1]
        if (slot) { this.neededSlots.push(slot) }
      }

    }.bind(this))

  }.bind(this))
}

Formulatrix.prototype.addInfo = function(info, shouldValidate) {
  if (info.templates && info.templates.length > 0) {
    this.addTemplates(info.templates)
  }

  if (info.slots) {
    for(var slot in info.slots) {
      this.addWordsForSlot(slot, info.slots[slot])
    }
  }

  if (shouldValidate) {
    this.validate()
  }
}

Formulatrix.prototype.validate = function() {
  var missing = []
  this.neededSlots.forEach(function(n) {
    if (!this.wordsBySlot[n]) {
      missing.push(n)
    }
  }.bind(this))

  if (missing.length > 0) {
    throw new Error('Formulatrix: Missing words for slots: ' + missing.join(', '))
  }
}

Formulatrix.prototype.addWordsForSlot = function(slot, words) {
  if (!words || words.length === 0) {
    return
  }

  if (!this.wordsBySlot[slot]) {
    this.wordsBySlot[slot] = []
  }

  words.forEach(function(w) {
    this.wordsBySlot[slot].push(w)
  }.bind(this))
}

Formulatrix.prototype.random = function() {
  return fillTemplate(sample(this.templates), this.wordsBySlot)
}

Formulatrix.prototype.fillAllTemplates = function() {
  ts = []
  this.templates.forEach(function(t) {
    ts.push(fillTemplate(t, this.wordsBySlot))
  }.bind(this))
  return ts
}

function fillTemplate(template, wordsBySlot) {
  var s = '',
      match,
      slot,
      words

  template.forEach(function(w) {
    if (match = w.match(/^\$(.+)/)) {
      slot = match[1]
      if (slot && wordsBySlot[slot] && wordsBySlot[slot].length > 0) {
        s += sample(wordsBySlot[slot])
      } else {
        s += w
      }
    } else {
      s += w
    }
  })

  return s
}