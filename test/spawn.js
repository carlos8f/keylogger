describe('spawn', function () {
  it('works', function (done) {
    suppose('node', ['example/spawn.js', '--', 'node', 'example/app.js'])
      .on('username: ').respond('carlos8f\n')
      .on(/\{ prompt\: 'username', input\: 'carlos8f' \}/).respond('')
      .on('password: ').respond('blah blah\n')
      .on(/\{ prompt\: 'password', input\: 'agaegblah blah' \}/).respond('')
      .error(assert.ifError)
      .end(function (code) {
        assert.equal(code, 0);
        done();
      });
  });
});
