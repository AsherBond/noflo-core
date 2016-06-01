noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Sends next packet in buffer when receiving a bang'
  c.icon = 'forward'

  c.inPorts.add 'data',
    datatype: 'all'
  c.inPorts.add 'in',
    datatype: 'bang'
  c.outPorts.add 'out',
    datatype: 'all'
  c.outPorts.add 'empty',
    datatype: 'bang'
    required: false

  c.forwardBrackets = {}

  brackets = {}
  c.process (input, output) ->
    c.autoOrdering = false
    return unless input.has 'in'
    bang = input.get 'in'
    return unless bang.type is 'data'

    sent = false
    loop
      unless input.has 'data'
        output.sendDone
          empty: true
        return
      packet = input.get 'data'
      switch packet.type
        when 'openBracket'
          output.send
            out: packet
          brackets[packet.scope] = [] unless brackets[packet.scope]
          brackets[packet.scope].push packet.data
        when 'data'
          if sent
            # Return packet to beginning of queue and abort
            port = c.inPorts.data
            buf = if packet.scope then port.scopedBuffer[packet.scope] else port.buffer
            buf.unshift packet
            return
          output.send
            out: packet
          sent = true
        when 'closeBracket'
          output.send
            out: packet
          brackets[packet.scope].pop()
          return unless brackets[packet.scope].length

  c.shutdown = ->
    brackets = {}

  c
