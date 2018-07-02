import React from 'react';
import { Table, Tooltip, OverlayTrigger } from 'react-bootstrap';

const rlRowTp = (content, rowId) => (
  <Tooltip id={rowId}>
    <p>{ content }</p>
  </Tooltip>
);

const rlRowCont = (content, rowId) => {
  const overlay = rlRowTp(content, rowId);
  return (
    <OverlayTrigger placement="top" overlay={overlay}>
      <p>{ content ? content.substring(0, 15) : '' }</p>
    </OverlayTrigger>
  );
};

const tableHeader = () => (
  <thead>
    <tr>
      <th>Label</th>
      <th>Image*</th>
      <th>Name</th>
      <th>InChI</th>
      <th>InChIKey</th>
      <th>Long-RInChIKey</th>
      <th>Web-RInChIKey</th>
      <th>Short-RInChIKey</th>
    </tr>
  </thead>
);

const rowContent = (p, long, short, web, idx) => (
  <tr>
    <td className="one-line" >{p.short_label}</td>
    <td className="one-line" >{}</td>
    <td className="one-line" >{rlRowCont(p.molecule.iupac_name)}</td>
    <td className="one-line" >{rlRowCont(p.molecule.inchikey)}</td>
    <td className="one-line" >{rlRowCont(p.molecule.inchistring)}</td>
    <td className="one-line" >{rlRowCont(long, idx)}</td>
    <td className="one-line" >{rlRowCont(short, idx)}</td>
    <td className="one-line" >{rlRowCont(web, idx)}</td>
  </tr>
);

const tableBody = objs => (
  <tbody>
    {
      objs.map((r, idx) => {
        const long = r.rinchi_long_key;
        const short = r.rinchi_short_key;
        const web = r.rinchi_web_key;
        return r.products.map(p => rowContent(p, long, short, web, idx));
      })
    }
  </tbody>
);

const SectionReactionList = ({ objs }) => (
  <div>
    <p>* Images are hidden in the preview.</p>
    <Table striped bordered condensed hover>
      { tableHeader() }
      { tableBody(objs) }
    </Table>
  </div>
);

export default SectionReactionList;
