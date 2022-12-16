import { Parser } from '@composite/parser';
import * as t from '@composite/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { PairInput } from '@app/components/pair-input';
import { SettingSection } from '@app/components/settings-section';
import { useEditor } from '@app/editor';

export const GlobalSettings = observer(() => {
  const editor = useEditor();
  const [isAddingNewGlobal, setIsAddingNewGlobal] = React.useState(false);

  return (
    <SettingSection
      collapsedOnInitial={false}
      title="Global Variables"
      onAdd={() => {
        setIsAddingNewGlobal(true);
      }}
    >
      <PairInput
        addingNewField={isAddingNewGlobal}
        onCancelAdding={() => setIsAddingNewGlobal(false)}
        onChange={(id, value) => {
          const parsedValue = Parser.parseExpressionFromSource(
            value,
            t.Expression
          );

          if (!id || !parsedValue) {
            return;
          }

          const existingGlobalStateName =
            editor.state.data.program.globals.find(
              (global) => global.name === id
            );

          editor.state.change(() => {
            if (!existingGlobalStateName) {
              editor.state.data.program.globals.push(
                t.val({
                  name: id,
                  init: parsedValue,
                })
              );

              return;
            }

            existingGlobalStateName.init = parsedValue;
          });
        }}
        values={editor.state.data.program.globals.map((global) => ({
          id: global.name,
          value: Parser.stringify(global.init),
        }))}
      />
    </SettingSection>
  );
});
