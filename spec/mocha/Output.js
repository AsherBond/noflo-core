describe('Output component', () => {
  let c = null;
  let ins1 = null;
  let ins2 = null;
  let out = null;
  before(function (done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    loader.load('core/Output', (err, instance) => {
      if (err) {
        done(err);
        return;
      }
      c = instance;
      ins1 = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins1);
      ins2 = noflo.internalSocket.createSocket();
      c.inPorts.in.attach(ins2);
      done();
    });
  });
  beforeEach(() => {
    out = noflo.internalSocket.createSocket();
    c.outPorts.out.attach(out);
  });
  afterEach(() => {
    c.outPorts.out.detach(out);
    out = null;
  });

  describe('when receiving packets from multiple inputs', () => {
    it('should send them as a single stream', (done) => {
      const expected = [
        'CONN',
        '< a',
        'DATA 1',
        '>',
        'DISC',
        'CONN',
        '< b',
        'DATA 2',
        '>',
        'DISC',
      ];
      const received = [];
      out.on('connect', () => received.push('CONN'));
      out.on('begingroup', group => received.push(`< ${group}`));
      out.on('data', data => received.push(`DATA ${data}`));
      out.on('endgroup', () => received.push('>'));
      out.on('disconnect', () => {
        received.push('DISC');
        if (received.length !== expected.length) { return; }
        chai.expect(received).to.eql(expected);
        done();
      });

      ins1.beginGroup('a');
      ins1.send(1);
      ins1.endGroup();
      ins1.disconnect();

      ins2.beginGroup('b');
      ins2.send(2);
      ins2.endGroup();
      ins2.disconnect();
    });
  });
});
