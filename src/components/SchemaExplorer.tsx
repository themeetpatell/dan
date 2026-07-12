'use client';

import { useState } from 'react';
import { Icon } from '@/lib/icons';
import type { SchemaResource } from '@/lib/connector-flow';

/* Three-pane read-only API schema browser: resources → fields → type detail.
   Used on the connect flow (preview) and the connector detail Access config tab. */
export default function SchemaExplorer({ resources }: { resources: SchemaResource[] }) {
  const [resourceIdx, setResourceIdx] = useState(0);
  const [fieldIdx, setFieldIdx] = useState(0);

  const resource = resources[resourceIdx];
  const field = resource?.fields[fieldIdx];

  if (!resource) return null;

  return (
    <div className="schema">
      <div className="schema__cols">
        <div className="schema__list">
          <div className="schema__list-head">
            <Icon.grid size={13} />
            Resources
            <span className="schema__count">{resources.length}</span>
          </div>
          {resources.map((r, i) => (
            <button
              key={r.name}
              className="schema-item mono"
              data-on={i === resourceIdx}
              onClick={() => {
                setResourceIdx(i);
                setFieldIdx(0);
              }}
            >
              {r.name}
              <span className="schema__count">{r.fields.length}</span>
            </button>
          ))}
        </div>

        <div className="schema__main">
          <div className="schema__res-head">
            <div className="schema__res-name mono">
              <Icon.layers size={14} />
              {resource.name}
            </div>
            <p>{resource.desc}</p>
          </div>

          <div className="schema__split">
            <div className="schema__list schema__list--fields">
              <div className="schema__list-head">
                <Icon.logs size={13} />
                Fields
                <span className="schema__count">{resource.fields.length}</span>
              </div>
              {resource.fields.map((f, i) => (
                <button
                  key={f.name}
                  className="schema-item mono"
                  data-on={i === fieldIdx}
                  onClick={() => setFieldIdx(i)}
                >
                  {f.name}
                </button>
              ))}
            </div>

            <div className="schema__type">
              {field && (
                <>
                  <div className="schema__type-row">
                    <span className="schema__type-label"># Type</span>
                    <span className="type-chip mono">{field.type}</span>
                  </div>
                  <p>{field.desc}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
