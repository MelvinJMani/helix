import liveServer from 'live-server';

const serve = ({ path, port, open }) => {
  liveServer.start({
    port,
    root: path,
    open,
    logLevel: 0
  });
};

export default { serve };
