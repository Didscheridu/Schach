// Initialisierung von Brett und Logik
var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

function onDragStart (source, piece, position, orientation) {
  // Keine Züge erlauben, wenn das Spiel vorbei ist
  if (game.game_over()) return false

  // Nur Weiß darf gezogen werden (Mensch spielt Weiß)
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function makeRandomMove () {
  var possibleMoves = game.moves()

  // Spiel vorbei?
  if (possibleMoves.length === 0) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())
  updateStatus()
}

function onDrop (source, target) {
  // Prüfen, ob der Zug legal ist
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // HINWEIS: Immer zur Dame umwandeln der Einfachheit halber
  })

  // Wenn ungültig, Figur zurückschnappen lassen
  if (move === null) return 'snapback'

  // Status aktualisieren
  updateStatus()

  // Computer macht einen Zug nach 250ms Verzögerung
  window.setTimeout(makeRandomMove, 250)
}

// Brettposition aktualisieren nach Rochade, En Passant etc.
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'Weiß'
  if (game.turn() === 'b') {
    moveColor = 'Schwarz'
  }

  // Schachmatt?
  if (game.in_checkmate()) {
    status = 'Spiel vorbei, ' + moveColor + ' ist schachmatt.'
  }

  // Remis?
  else if (game.in_draw()) {
    status = 'Spiel vorbei, unentschieden.'
  }

  // Spiel läuft noch
  else {
    status = moveColor + ' ist am Zug'

    // Schach?
    if (game.in_check()) {
      status += ', ' + moveColor + ' steht im Schach'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)

updateStatus()
