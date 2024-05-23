import { registerPlugin } from '@wordpress/plugins';
import { language, more } from '@wordpress/icons';
import { PluginSidebar as  PluginSidebarPost } from "@wordpress/edit-post";
import { __ } from "@wordpress/i18n";
import { addFilter, addAction, removeFilter } from "@wordpress/hooks";
import { useState, useEffect, useRef, useCallback, useMemo } from "@wordpress/element";
import { PanelBody, Button, Popover, Dashicon, TabPanel, PanelRow, 
     __experimentalText as Text, __experimentalHStack as HStack, Dropdown,
    DropdownMenu, MenuItem, MenuGroup, SelectControl  } from "@wordpress/components";

import { dispatch, useSelect, withSelect, withDispatch, useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import {
    __experimentalColorGradientControl as ColorGradientControl,
    BlockPreview,
    PanelColorSettings
} from "@wordpress/block-editor";

import { createBlock, store as blocksStore, parse } from "@wordpress/blocks";

import {Component} from 'react';

import "./store";

import { compose } from '@wordpress/compose';

 import {cookieKey} from './store/constants'



const Sidebar = (p) => {
    const PluginSidebar = wp.editSite ? wp.editSite.PluginSidebar : PluginSidebarPost;

    const {getCurrectLanguage, getLanguagesList, 
        savePost, isPreview, 
        dirtyEntityRecords, siteEntityConfig, siteEdits} = p;


    const EntityRecords = useMemo( () => {
        // Remove site object and decouple into its edited pieces.
        const editedEntitiesWithoutSite = dirtyEntityRecords.filter(
            ( record ) => ! ( record.kind === 'root' && record.name === 'site' )
        );

        const siteEntityLabels = siteEntityConfig?.meta?.labels ?? {};
        const editedSiteEntities = [];
        for ( const property in siteEdits ) {
            editedSiteEntities.push( {
                kind: 'root',
                name: 'site',
                title: siteEntityLabels[ property ] || property,
                property,
            } );
        }

        return [ ...editedEntitiesWithoutSite, ...editedSiteEntities ];
    }, [ dirtyEntityRecords, siteEdits, siteEntityConfig ] );

 
    // const saveAllEntities = () => {

    //     const PUBLISH_ON_SAVE_ENTITIES = [
	// 		{ kind: 'postType', name: 'wp_navigation' },
	// 	];

    //     const siteItemsToSave = [];
	// 	const pendingSavedRecords = [];
	// 	EntityRecords.forEach( ( { kind, name, key, property } ) => {
	// 		if ( 'root' === kind && 'site' === name ) {
	// 			siteItemsToSave.push( property );
	// 		} else {
	// 			if (
	// 				PUBLISH_ON_SAVE_ENTITIES.some(
	// 					( typeToPublish ) =>
	// 						typeToPublish.kind === kind &&
	// 						typeToPublish.name === name
	// 				)
	// 			) {
	// 				window.wp.data
	// 					.dispatch( 'core' )
	// 					.editEntityRecord( kind, name, key, {
	// 						status: 'publish',
	// 					} );
	// 			}  

	// 			pendingSavedRecords.push(
	// 				window.wp.data
	// 					.dispatch( 'core' )
	// 					.saveEditedEntityRecord( kind, name, key )
	// 			);
	// 		}
	// 	} );
	// 	if ( siteItemsToSave.length ) {
	// 		pendingSavedRecords.push(
	// 			window.wp.data
	// 				.dispatch( 'core' )
	// 				.__experimentalSaveSpecifiedEntityEdits(
	// 					'root',
	// 					'site',
	// 					undefined,
	// 					siteItemsToSave
	// 				)
	// 		);
	// 	}


    //     window.wp.data
    //     .dispatch( 'core/block-editor' )
    //     .__unstableMarkLastChangeAsPersistent();
        
    //     return Promise.all( pendingSavedRecords )
    // }

    // useEffect(()=>{
    //     console.log(dirtyEntityRecords)
    //     console.log(EntityRecords)
    // },[dirtyEntityRecords, EntityRecords ])

    const changeLang = useCallback(async (lang) => {
        dispatch('qtranslate-xt').setCurrentLanguage(lang);
        console.log(dirtyEntityRecords)
        console.log(EntityRecords)
  

        document.cookie = `${cookieKey}=${lang};path=/`;

        //  await saveAllEntities();

        addFilter(
            'editor.__unstableSavePost',
            'plugin',
            function(res, option ) {
                removeFilter('editor.__unstableSavePost','plugin');
                
                const wpHTML = window.wp.data.select('core/editor').getCurrentPost().content;
                const blockList = parse( wpHTML );
                // console.log(wpHTML)
                wp.data.dispatch('core/editor').resetEditorBlocks(blockList);
                // console.log(blockList)
    
                return res.then(_ => option)
            });

          
        window.wp.data
        .dispatch( 'core/block-editor' )
        .__unstableMarkLastChangeAsPersistent();

        
        // await window.wp.data
        //     .dispatch( 'core' )
        //     .editEntityRecord( 'postType', 'wp_navigation', undefined);

        await window.wp.data
        .dispatch( 'core' )
        .__experimentalSaveSpecifiedEntityEdits(
            'root',
            'site',
            undefined,
            ['title']
        );

        await savePost(isPreview);
        window.location.reload();
    })

    return < >
            <PluginSidebar
                className="qtranstale-post"
                icon={language}
                name="qtranstale-post"
                title={__("Qtranslate XT Blocks", "qtranslate")}
            >
            <div className="qt-panel-control">
                    <PanelBody
                        title={__("Content Language", "qtranslate-xt")}
                        initialOpen={true}
                    >
                        {/* <HStack className={'editor-post-panel__row'}>
                            <Text as='div' className='editor-post-panel__row-label'>{__("Select language:", "qtranslate-xt")}</Text>
                            <Text as='div' className='editor-post-panel__row-control'>
                                <Dropdown 
                                    renderToggle={ ( { isOpen, onToggle } ) => (
                                      <Button
                                        variant="components-button is-next-40px-default-size is-tertiary"
                                        onClick={ onToggle }
                                        aria-expanded={ isOpen }
                                      >
                                        {getLanguagesList ? getLanguagesList[getCurrectLanguage]?.name : getCurrectLanguage}
                                      </Button>
                                    )}
                                    label="Language"
                                    renderContent={({ onClose }) => (
                                        <>
                                            <MenuGroup>
                                                {getLanguagesList && Object.entries(getLanguagesList).map(([lang, param]) => (
                                                    <MenuItem onClick={ (p,a) => (changeLang(lang), onClose(p)) }>
                                                        {param.name}
                                                    </MenuItem>
                                                ))}
                                            </MenuGroup>
                                        </>
                                    )}
                                    />
                            </Text>
                        </HStack> */}
                        <SelectControl
                               label={__("Select language:", "qtranslate-xt")}
                               value={getCurrectLanguage}
                               options={ 
                                getLanguagesList ? Object.entries(getLanguagesList).map(([lang, param]) => (
                                    { label: param.name, value: lang }
                                )): []}
                               onChange={ changeLang }
                             />
                    </PanelBody>
                </div>
        </PluginSidebar>
 
        
    </>
};



addAction('plugins.pluginRegistered', 'plugin', function(
    options, name
) {
      console.log(options, name)
}, 1)


const def = compose([
    withSelect((select) => {
        return {
            getCurrectLanguage: select('qtranslate-xt').getCurrentLanguage(),
            getLanguagesList: select('qtranslate-xt').getLanguages(),
            isPreview: select('core/editor').isPreviewingPost(),
            dirtyEntityRecords: select('core').__experimentalGetDirtyEntityRecords(),
            siteEdits: select('core').getEntityRecordEdits( 'root', 'site' ),
            siteEntityConfig: select('core').getEntityConfig( 'root', 'site' )
        }
    }),
    withDispatch((dispatch) => {
        return {
            savePost: ( isPreview ) => {
				dispatch('core/editor').savePost({isPreview: isPreview});
			},
        };
    })
])
(Sidebar);

registerPlugin( 'qtranslate-xt-switch', {
    icon: language,
    render: def,
});
